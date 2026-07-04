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
import { Clock } from 'lucide-react';

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

// Placeholder page for Attendance & Time Off modules
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-border/50 shadow-sm min-h-[50vh] relative overflow-hidden">
    <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10" />
    <div className="bg-primary/10 p-4 rounded-full text-primary mb-3">
      <Clock className="h-8 w-8 animate-bounce" />
    </div>
    <h3 className="text-lg font-bold text-foreground">{title} Module</h3>
    <p className="text-xs text-muted-foreground mt-2 max-w-sm">
      This page is under active development. The underlying routes and state structures are prepared for full integration.
    </p>
  </div>
);

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
