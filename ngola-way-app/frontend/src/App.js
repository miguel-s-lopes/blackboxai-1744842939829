import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout Components
import Layout from './components/common/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Client Pages
import Home from './pages/Home';
import BookRide from './pages/client/BookRide';
import BookStay from './pages/client/BookStay';
import ClientProfile from './pages/client/Profile';

// Driver Pages
import DriverDashboard from './pages/driver/Dashboard';
import DriverRides from './pages/driver/Rides';
import DriverProfile from './pages/driver/Profile';

// Host Pages
import HostDashboard from './pages/host/Dashboard';
import HostProperties from './pages/host/Properties';
import HostProfile from './pages/host/Profile';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Common Routes */}
            <Route index element={<Home />} />

            {/* Client Routes */}
            <Route
              path="book-ride"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <BookRide />
                </ProtectedRoute>
              }
            />
            <Route
              path="book-stay"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <BookStay />
                </ProtectedRoute>
              }
            />
            <Route
              path="client/profile"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientProfile />
                </ProtectedRoute>
              }
            />

            {/* Driver Routes */}
            <Route path="driver">
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="rides"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <DriverRides />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <DriverProfile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Host Routes */}
            <Route path="host">
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={['host']}>
                    <HostDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="properties"
                element={
                  <ProtectedRoute allowedRoles={['host']}>
                    <HostProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute allowedRoles={['host']}>
                    <HostProfile />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900">404</h1>
                  <p className="mt-2 text-lg text-gray-600">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
