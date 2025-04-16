import { ReactElement } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/common/Loading';

interface ProtectedRouteProps {
  children: ReactElement;
  requireGuest?: boolean;
  roles?: string[];
}

export const ProtectedRoute = ({
  children,
  requireGuest = false,
  roles = [],
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  // If route requires guest access and user is logged in
  if (requireGuest && user) {
    return <Navigate to="/" replace />;
  }

  // If route requires authentication and user is not logged in
  if (!requireGuest && !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If route requires specific roles and user doesn't have them
  if (roles.length > 0 && !roles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
