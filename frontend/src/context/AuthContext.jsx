import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data on startup if token exists
  useEffect(() => {
    const token = localStorage.getItem('bookish_token');
    if (token) {
      // dj-rest-auth user detail endpoint
      client.get('/auth/user/')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          // If token is invalid/expired, clear it
          localStorage.removeItem('bookish_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // dj-rest-auth login returns { key }
      const response = await client.post('/auth/login/', { email, password });
      const { key } = response.data;
      localStorage.setItem('bookish_token', key);
      
      // Fetch user info
      const userRes = await client.get('/auth/user/');
      setUser(userRes.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { non_field_errors: ['Invalid email or password.'] },
      };
    }
  };

  const register = async (email, password, displayName) => {
    try {
      // Generate a username based on the email prefix for compatibility with dj-rest-auth
      const baseUsername = email.split('@')[0];
      const username = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
      
      // dj-rest-auth registration endpoint
      const response = await client.post('/auth/registration/', {
        username,
        email,
        password1: password,
        password2: password,
        display_name: displayName,
      });
      const { key } = response.data;
      localStorage.setItem('bookish_token', key);

      // Fetch user info
      const userRes = await client.get('/auth/user/');
      setUser(userRes.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { non_field_errors: ['Registration failed.'] },
      };
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const response = await client.post('/auth/google/', {
        access_token: 'dummy_token',
        id_token: idToken,
      });
      const { key } = response.data;
      localStorage.setItem('bookish_token', key);
      
      const userRes = await client.get('/auth/user/');
      setUser(userRes.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { non_field_errors: ['Google login failed.'] },
      };
    }
  };

  const logout = async () => {
    try {
      await client.post('/auth/logout/');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('bookish_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
export default AuthContext;
