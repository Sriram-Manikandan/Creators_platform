import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Header    from './components/layout/Header';
import Footer    from './components/layout/Footer';
import Home      from './pages/Home';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';

// ─── Protected Route wrapper ──────────────────────────────────────────────
// Redirects to /login if user is not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Still restoring session from localStorage — don't redirect yet
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#6366f1', fontFamily: 'sans-serif', fontSize: '0.95rem',
      }}>
        Restoring session...
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

// ─── App Layout (inside Router so Header can use useNavigate) ─────────────
function AppLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected: only accessible when logged in */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* 404 catch-all */}
        <Route path="*" element={
          <div style={{
            minHeight: '60vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#0a0a0a', color: '#64748b', fontFamily: 'sans-serif',
          }}>
            <h1 style={{ fontSize: '4rem', color: '#1f2937' }}>404</h1>
            <p>Page not found</p>
          </div>
        } />
      </Routes>
      <Footer />
    </>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────
// Order matters: BrowserRouter → AuthProvider → AppLayout
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}