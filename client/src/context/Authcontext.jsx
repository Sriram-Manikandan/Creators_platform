import { createContext, useContext, useState, useEffect } from 'react';

// ─── 1. Create the Context ────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── 2. AuthProvider Component ────────────────────────────────────────────
export function AuthProvider({ children }) {

  const [user, setUser]       = useState(null);   // Logged-in user object
  const [token, setToken]     = useState(null);   // JWT token
  const [loading, setLoading] = useState(true);   // True while restoring session

  // ── Restore session on page refresh ──────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // Done checking — app can render now
  }, []);

  // ── Login: save to state + localStorage ──────────────────────────────
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ── Logout: clear state + localStorage ───────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // ── Helper: is anyone logged in? ─────────────────────────────────────
  const isAuthenticated = () => !!token && !!user;

  // ── Value shared with all components ─────────────────────────────────
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── 3. Custom Hook ───────────────────────────────────────────────────────
// Any component calls useAuth() to access auth state — no prop drilling!
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}

export default AuthContext;