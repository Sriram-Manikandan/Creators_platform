import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Header    from './components/layout/Header';
import Footer    from './components/layout/Footer';
import Home      from './pages/Home';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

// ─── App Layout (inside Router so Header can use useNavigate) ─────────────
function AppLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"         element={<Home />} />
        
        {/* Public: only accessible when logged out */}
        <Route path="/login"    element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected: only accessible when logged in */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-post" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path="/edit-post/:id" element={
          <ProtectedRoute>
            <EditPost />
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