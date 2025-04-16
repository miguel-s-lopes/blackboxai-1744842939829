import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Layout from '@/components/common/Layout';
import { useAuth } from '@/hooks/useAuth';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">
        Ngola Way
      </Link>
      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-primary-600">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="hover:text-primary-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/auth/login" className="hover:text-primary-600">
              Login
            </Link>
            <Link to="/auth/register" className="hover:text-primary-600">
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <p>© {new Date().getFullYear()} Ngola Way. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <Link to="/privacy" className="hover:text-primary-600">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:text-primary-600">
          Terms of Service
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Layout>
            <Layout.Header>
              <Header />
            </Layout.Header>
            
            <Layout.Main>
              <Routes>
                {/* Public routes */}
                <Route
                  path="/auth/login"
                  element={
                    <ProtectedRoute requireGuest>
                      <Login />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auth/register"
                  element={
                    <ProtectedRoute requireGuest>
                      <Register />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auth/forgot-password"
                  element={
                    <ProtectedRoute requireGuest>
                      <ForgotPassword />
                    </ProtectedRoute>
                  }
                />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <div>Admin Dashboard</div>
                    </ProtectedRoute>
                  }
                />

                {/* 404 route */}
                <Route
                  path="*"
                  element={
                    <div className="flex min-h-[50vh] flex-col items-center justify-center">
                      <h1 className="text-4xl font-bold">404</h1>
                      <p className="mt-2 text-gray-600">Page not found</p>
                    </div>
                  }
                />
              </Routes>
            </Layout.Main>

            <Layout.Footer>
              <Footer />
            </Layout.Footer>
          </Layout>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
