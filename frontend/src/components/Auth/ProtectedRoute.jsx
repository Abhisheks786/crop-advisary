import React from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Mock auth state - replace with real auth later
  const isAuthenticated = true;
  const user = { role: 'admin' };
  const isLoading = false;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
