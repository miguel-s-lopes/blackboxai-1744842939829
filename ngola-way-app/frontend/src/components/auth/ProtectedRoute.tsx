import { ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth'; 
import { Loading } from 'components/common/Loading';

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
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  // If route requires guest access and user is logged in
  if (requireGuest && user) {
    navigate('/');
    return null;
  }

  // If route requires authentication and user is not logged in
  if (!requireGuest && !user) {
    navigate('/auth/login', { state: { from: location } });
    return null;
  }

  // If route requires specific roles and user doesn't have them
  if (roles.length > 0 && !roles.includes(user?.role || '')) {
    navigate('/');
    return null;
  }

  return children;
};

export default ProtectedRoute;
