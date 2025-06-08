import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component to guard routes that require authentication.
 * If no token is found in localStorage, redirects to login page.
 * Otherwise, renders the child components (protected content).
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If token is not present, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected child components
  return children;
};

export default ProtectedRoute;
