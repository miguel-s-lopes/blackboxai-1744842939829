import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const { showError } = useNotification();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    showError('Please sign in to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.user_metadata?.role)) {
    showError('You do not have permission to access this page');
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected content
  return children;
}

// Higher-order component for role-based route protection
export function withRoleProtection(Component, allowedRoles = []) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export default ProtectedRoute;
