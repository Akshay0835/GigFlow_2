import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import useThemeStore from './store/useThemeStore';
import useAuthStore from './store/useAuthStore';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }
  return <>{children}</>;
};

// Public Route wrapper (redirects to home if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />
      <Route path="/verify" element={
        <PublicRoute>
          <Verify />
        </PublicRoute>
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
