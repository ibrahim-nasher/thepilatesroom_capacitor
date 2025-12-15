import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store';

// Layouts
import AuthLayout from '@components/layout/AuthLayout';
import MainLayout from '@components/layout/MainLayout';

// Auth Pages
import LoginPage from '@pages/Auth/LoginPage';
import RegisterPage from '@pages/Auth/RegisterPage';
import ForgotPasswordPage from '@pages/Auth/ForgotPasswordPage';

// Main Pages
import HomePage from '@pages/Home/HomePage';
import ClassesPage from '@pages/Classes/ClassesPage';
import ClassDetailPage from '@pages/Classes/ClassDetailPage';
import PackagesPage from '@pages/Packages/PackagesPage';
import PackageDetailPage from '@pages/Packages/PackageDetailPage';
import BookingsPage from '@pages/Bookings/BookingsPage';
import BookingDetailPage from '@pages/Bookings/BookingDetailPage';
import ProfilePage from '@pages/Profile/ProfilePage';
import EditProfilePage from '@pages/Profile/EditProfilePage';
import NotificationsPage from '@pages/Notifications/NotificationsPage';

// Protected Route wrapper - only for features that require login (booking, profile)
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isGuest = useAuthStore(state => state.isGuest);
  
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  
  // If guest user tries to access protected feature, redirect to login
  if (isGuest) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route wrapper (redirects to home if authenticated)
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes (Auth) */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
      </Route>

      {/* Main app routes - accessible to everyone (guest + authenticated) */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/classes/:scheduleId" element={<ClassDetailPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:packageId" element={<PackageDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Protected routes - require actual login */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
