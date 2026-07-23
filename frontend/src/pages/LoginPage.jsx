import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, AlertCircle, ArrowLeft, Key, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1081512401662-7k7d53h7b55mcd7t95j6u41g0d8m2c6d.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: '382' }
        );
      } else {
        setTimeout(initializeGoogleSignIn, 100);
      }
    };
    initializeGoogleSignIn();
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setErrors({});
    const result = await googleLogin(response.credential);
    setLoading(false);
    if (result.success) {
      navigate('/home');
    } else {
      if (result.error.non_field_errors) {
        setErrors({ non_field_errors: result.error.non_field_errors[0] });
      } else {
        setErrors(result.error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Basic validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      // Map DRF / dj-rest-auth errors
      if (result.error.non_field_errors) {
        setErrors({ non_field_errors: result.error.non_field_errors[0] });
      } else {
        setErrors(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative leaf details */}
      <div className="absolute w-64 h-64 -top-32 -right-32 bg-rejuvenate/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute w-64 h-64 -bottom-32 -left-32 bg-rejuvenate/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-cream border-2 border-specialOps/40 p-8 rounded-3xl shadow-cozy relative">
        {/* Decorative Tape effect */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-rejuvenate/40 border border-specialOps/20 opacity-70 transform rotate-1 shadow-sm"></div>

        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-specialOps hover:text-nettle transition mb-4 text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Nest</span>
          </Link>
          <div className="p-3 bg-nettle/10 text-nettle rounded-2xl mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-nettle">Welcome Back</h2>
          <p className="text-sm text-specialOps font-medium mt-1">Enter your reading room</p>
        </div>

        {errors.non_field_errors && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-2.5 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{errors.non_field_errors}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-nettle mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-specialOps" />
              <input
                id="email"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.email;
                      return copy;
                    });
                  }
                }}
                className="w-full pl-11 pr-4 py-3 bg-cream border border-specialOps/30 focus:border-nettle rounded-2xl outline-none transition text-sm text-pepper font-medium"
              />
            </div>
            {errors.email && (
              <p className="text-red-700 text-xs mt-1 font-semibold">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-nettle" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-specialOps" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.password;
                      return copy;
                    });
                  }
                }}
                className="w-full pl-11 pr-4 py-3 bg-cream border border-specialOps/30 focus:border-nettle rounded-2xl outline-none transition text-sm text-pepper font-medium"
              />
            </div>
            {errors.password && (
              <p className="text-red-700 text-xs mt-1 font-semibold">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-nettle hover:bg-darkestForest disabled:bg-nettle/60 text-cream font-bold rounded-2xl transition duration-300 shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Enter Reading Room'
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-specialOps/20"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-cream px-2 text-specialOps font-semibold">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div id="google-signin-btn" className="w-full min-h-[44px]"></div>
        </div>



        <p className="text-center text-sm text-pepper/80 mt-8">
          New to the corner?{' '}
          <Link to="/register" className="font-bold text-nettle hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
