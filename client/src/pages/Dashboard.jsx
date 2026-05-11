import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ─── Session guard: redirect if not logged in ─────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');   // Not authenticated → back to login
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // ─── Logout ───────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Loading state while checking auth
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ color: '#6366f1', fontFamily: 'sans-serif' }}>Verifying session...</div>
      </div>
    );
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          color: #f1f5f9;
        }

        /* ── Top bar ── */
        .dash-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 2.5rem;
          border-bottom: 1px solid #1f2937;
          background: #0d0d0d;
        }
        .dash-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem; color: #f8fafc;
        }
        .dash-logo span { color: #818cf8; font-style: italic; }
        .dash-topbar-right { display: flex; align-items: center; gap: 1rem; }
        .dash-user-pill {
          display: flex; align-items: center; gap: 10px;
          background: #111827; border: 1px solid #1f2937;
          padding: 6px 14px 6px 8px; border-radius: 999px;
        }
        .dash-avatar-sm {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700; color: #fff;
        }
        .dash-user-name { font-size: 0.85rem; color: #e2e8f0; font-weight: 500; }
        .logout-btn {
          padding: 8px 18px;
          background: transparent;
          border: 1px solid #ef4444;
          border-radius: 8px;
          color: #f87171;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.1); }

        /* ── Main content ── */
        .dash-main { max-width: 960px; margin: 0 auto; padding: 3rem 2rem; }

        .dash-greeting {
          margin-bottom: 2.5rem;
        }
        .dash-greeting h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 2.4rem; color: #f8fafc; margin-bottom: 0.4rem;
        }
        .dash-greeting h1 em { font-style: italic; color: #a5b4fc; }
        .dash-greeting p { color: #64748b; font-size: 0.95rem; }

        /* ── Cards row ── */
        .dash-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
        .dash-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 14px;
          padding: 1.5rem;
        }
        .dash-card-icon { font-size: 1.6rem; margin-bottom: 0.75rem; }
        .dash-card-label { font-size: 0.75rem; color: #64748b; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 4px; }
        .dash-card-value { font-size: 1.5rem; font-weight: 700; color: #f8fafc; }
        .dash-card-sub { font-size: 0.78rem; color: #475569; margin-top: 4px; }

        /* ── Profile section ── */
        .dash-profile {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 14px;
          padding: 2rem;
          display: flex; gap: 2rem; align-items: flex-start;
          margin-bottom: 2rem;
        }
        .dash-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }
        .dash-profile-info h2 { font-size: 1.2rem; font-weight: 600; color: #f8fafc; margin-bottom: 4px; }
        .dash-profile-info p { font-size: 0.875rem; color: #64748b; margin-bottom: 12px; }
        .profile-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc; font-size: 0.75rem; font-weight: 600;
          padding: 4px 12px; border-radius: 999px;
        }
        .profile-badge::before { content: '●'; font-size: 0.5rem; }

        /* ── JWT info box ── */
        .dash-jwt-box {
          background: #0d1117;
          border: 1px solid #1f2937;
          border-radius: 14px;
          padding: 1.5rem;
        }
        .dash-jwt-box h3 {
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: #6366f1; margin-bottom: 1rem;
          display: flex; align-items: center; gap: 8px;
        }
        .jwt-detail { display: flex; flex-direction: column; gap: 0.75rem; }
        .jwt-row { display: flex; align-items: flex-start; gap: 1rem; }
        .jwt-key { font-size: 0.78rem; color: #475569; width: 100px; flex-shrink: 0; padding-top: 2px; font-weight: 500; }
        .jwt-val {
          font-family: monospace; font-size: 0.8rem; color: #94a3b8;
          word-break: break-all; line-height: 1.6;
          background: #161b22; padding: 6px 10px; border-radius: 6px; flex: 1;
        }
        .jwt-val.highlight { color: #a5b4fc; }

        @media (max-width: 640px) {
          .dash-cards { grid-template-columns: 1fr; }
          .dash-topbar { padding: 1rem; }
          .dash-main { padding: 1.5rem 1rem; }
          .dash-profile { flex-direction: column; }
        }
      `}</style>

      <div className="dash-root">
        {/* ── Topbar ── */}
        <header className="dash-topbar">
          <div className="dash-logo">Creator<span>'s</span> Platform</div>
          <div className="dash-topbar-right">
            <div className="dash-user-pill">
              <div className="dash-avatar-sm">{initials}</div>
              <span className="dash-user-name">{user.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="dash-main">
          <div className="dash-greeting">
            <h1>Hello, <em>{user.name.split(' ')[0]}</em> 👋</h1>
            <p>Welcome to your dashboard. Your session is active and secured.</p>
          </div>

          {/* Stats cards */}
          <div className="dash-cards">
            <div className="dash-card">
              <div className="dash-card-icon">📝</div>
              <div className="dash-card-label">Posts</div>
              <div className="dash-card-value">0</div>
              <div className="dash-card-sub">Start creating content!</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon">👥</div>
              <div className="dash-card-label">Followers</div>
              <div className="dash-card-value">0</div>
              <div className="dash-card-sub">Grow your audience</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon">🔐</div>
              <div className="dash-card-label">Session</div>
              <div className="dash-card-value" style={{ color: '#22c55e', fontSize: '1rem', paddingTop: 4 }}>Active</div>
              <div className="dash-card-sub">JWT valid · 7 days</div>
            </div>
          </div>

          {/* Profile info */}
          <div className="dash-profile">
            <div className="dash-avatar">{initials}</div>
            <div className="dash-profile-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <span className="profile-badge">Member since {joinedDate}</span>
            </div>
          </div>

          {/* JWT details — great for video demo */}
          <div className="dash-jwt-box">
            <h3>🔐 Session Token (localStorage)</h3>
            <div className="jwt-detail">
              <div className="jwt-row">
                <span className="jwt-key">Storage Key</span>
                <span className="jwt-val highlight">token</span>
              </div>
              <div className="jwt-row">
                <span className="jwt-key">JWT</span>
                <span className="jwt-val">
                  {localStorage.getItem('token')?.slice(0, 60)}…
                </span>
              </div>
              <div className="jwt-row">
                <span className="jwt-key">User ID</span>
                <span className="jwt-val highlight">{user._id}</span>
              </div>
              <div className="jwt-row">
                <span className="jwt-key">Email</span>
                <span className="jwt-val">{user.email}</span>
              </div>
              <div className="jwt-row">
                <span className="jwt-key">Expires</span>
                <span className="jwt-val">7 days from login</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}