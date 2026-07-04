import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import { AppShell } from './components/shared/AppShell';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage';
import AttritionPage from './pages/AttritionPage';
import AttendancePage from './pages/AttendancePage';
import TimeOffPage from './pages/TimeOffPage';

// Route Guard to redirect unauthenticated users to Login
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Route Guard to redirect authenticated users away from Login/SignUp
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />

        {/* Protected Application Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell>
                <DashboardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <AppShell>
                <EmployeeProfilePage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AppShell>
                <AttendancePage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/timeoff"
          element={
            <ProtectedRoute>
              <AppShell>
                <TimeOffPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attrition"
          element={
            <ProtectedRoute>
              <AppShell>
                <AttritionPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
