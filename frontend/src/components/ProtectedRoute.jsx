import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream text-nettle">
        <div className="w-10 h-10 border-4 border-nettle border-t-transparent rounded-full animate-spin"></div>
        <p className="font-handwriting text-xl mt-4">Preparing your cozy reading corner...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
