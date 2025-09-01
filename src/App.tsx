import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { GroupPage } from '@/pages/GroupPage';
import { ExpensesPage } from '@/pages/ExpensesPage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Main application component with routing and providers
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes - redirect to dashboard if authenticated */}
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

              {/* Protected routes - require authentication */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups/:id"
                element={
                  <ProtectedRoute>
                    <GroupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups/:groupId/expenses"
                element={
                  <ProtectedRoute>
                    <ExpensesPage />
                  </ProtectedRoute>
                }
              />

              {/* Default redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/groups" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
