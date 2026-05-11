import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth(); // ← from context, no props!
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // Clears context state + localStorage
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2.5rem;
          background: #0d0d0d;
          border-bottom: 1px solid #1f2937;
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: #f8fafc;
          text-decoration: none;
        }
        .header-logo span { color: #818cf8; font-style: italic; }

        .header-nav { display: flex; align-items: center; gap: 0.5rem; }

        .nav-link {
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          color: #94a3b8;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: #f1f5f9; background: #111827; }

        .nav-btn {
          padding: 7px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s;
          border: none;
        }
        .nav-btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
        }
        .nav-btn-primary:hover { opacity: 0.85; }

        .nav-btn-logout {
          background: transparent;
          border: 1px solid #374151 !important;
          color: #f87171;
          border: none;
        }
        .nav-btn-logout:hover { background: rgba(239,68,68,0.1); }

        .nav-user {
          display: flex; align-items: center; gap: 10px;
        }
        .nav-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 700; color: #fff;
        }
        .nav-user-name { font-size: 0.875rem; color: #e2e8f0; font-weight: 500; }
      `}</style>

      <header className="header">
        <Link to="/" className="header-logo">
          Creator<span>'s</span> Platform
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>

          {isAuthenticated() ? (
            // ── Logged in: show user name + logout ──
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="nav-user">
                <div className="nav-avatar">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span className="nav-user-name">{user.name.split(' ')[0]}</span>
              </div>
              <button className="nav-btn nav-btn-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            // ── Logged out: show Login + Register ──
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register">
                <button className="nav-btn nav-btn-primary">Get Started</button>
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
}