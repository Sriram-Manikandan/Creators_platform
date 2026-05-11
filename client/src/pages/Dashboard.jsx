import { useAuth } from '../context/AuthContext';  // ← from context, no localStorage!
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, token, logout } = useAuth();  // ← Everything from context
  const navigate = useNavigate();

  // Note: No useEffect needed to check auth here!
  // ProtectedRoute in App.jsx already handles the redirect.
  // user is always available here if this component renders.

  const handleLogout = () => {
    logout();           // Context clears state + localStorage
    navigate('/login');
  };

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const initials = user.name
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root { min-height: 100vh; background: #0a0a0a; font-family: 'DM Sans', sans-serif; color: #f1f5f9; }

        .dash-main { max-width: 960px; margin: 0 auto; padding: 3rem 2rem; }

        .dash-greeting { margin-bottom: 2.5rem; }
        .dash-greeting h1 { font-family: 'DM Serif Display', serif; font-size: 2.4rem; color: #f8fafc; margin-bottom: 0.4rem; }
        .dash-greeting h1 em { font-style: italic; color: #a5b4fc; }
        .dash-greeting p { color: #64748b; font-size: 0.95rem; }

        .dash-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
        .dash-card { background: #111827; border: 1px solid #1f2937; border-radius: 14px; padding: 1.5rem; }
        .dash-card-icon { font-size: 1.6rem; margin-bottom: 0.75rem; }
        .dash-card-label { font-size: 0.75rem; color: #64748b; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 4px; }
        .dash-card-value { font-size: 1.5rem; font-weight: 700; color: #f8fafc; }
        .dash-card-sub { font-size: 0.78rem; color: #475569; margin-top: 4px; }

        .dash-profile { background: #111827; border: 1px solid #1f2937; border-radius: 14px; padding: 2rem; display: flex; gap: 2rem; align-items: flex-start; margin-bottom: 2rem; }
        .dash-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .dash-profile-info h2 { font-size: 1.2rem; font-weight: 600; color: #f8fafc; margin-bottom: 4px; }
        .dash-profile-info p { font-size: 0.875rem; color: #64748b; margin-bottom: 12px; }
        .profile-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); color: #a5b4fc; font-size: 0.75rem; font-weight: 600; padding: 4px 12px; border-radius: 999px; }

        /* Context info box — great for video demo! */
        .ctx-box { background: #0d1117; border: 1px solid #1f2937; border-radius: 14px; padding: 1.5rem; margin-bottom: 2rem; }
        .ctx-box h3 { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6366f1; margin-bottom: 1rem; }
        .ctx-row { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 0.75rem; }
        .ctx-key { font-size: 0.78rem; color: #475569; width: 120px; flex-shrink: 0; padding-top: 2px; font-weight: 500; }
        .ctx-val { font-family: monospace; font-size: 0.8rem; color: #94a3b8; word-break: break-all; line-height: 1.6; background: #161b22; padding: 6px 10px; border-radius: 6px; flex: 1; }
        .ctx-val.hi { color: #a5b4fc; }
        .ctx-val.green { color: #86efac; }

        .logout-section { text-align: center; padding: 1rem 0; }
        .logout-btn { padding: 10px 28px; background: transparent; border: 1px solid #ef4444; border-radius: 8px; color: #f87171; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .logout-btn:hover { background: rgba(239,68,68,0.1); }

        @media (max-width: 640px) { .dash-cards { grid-template-columns: 1fr; } .dash-profile { flex-direction: column; } .dash-main { padding: 1.5rem 1rem; } }
      `}</style>

      <div className="dash-root">
        <main className="dash-main">

          <div className="dash-greeting">
            <h1>Hello, <em>{user.name.split(' ')[0]}</em> 👋</h1>
            <p>Your session is active. Auth state is managed by React Context — not passed as props!</p>
          </div>

          {/* Stat cards */}
          <div className="dash-cards">
            <div className="dash-card">
              <div className="dash-card-icon">📝</div>
              <div className="dash-card-label">Posts</div>
              <div className="dash-card-value">0</div>
              <div className="dash-card-sub">Start creating!</div>
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

          {/* Profile */}
          <div className="dash-profile">
            <div className="dash-avatar">{initials}</div>
            <div className="dash-profile-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <span className="profile-badge">Member since {joinedDate}</span>
            </div>
          </div>

          {/* Context debug box — perfect for video demo */}
          <div className="ctx-box">
            <h3>⚛️ Auth Context State (useAuth)</h3>
            <div className="ctx-row">
              <span className="ctx-key">Source</span>
              <span className="ctx-val green">React Context API — no prop drilling!</span>
            </div>
            <div className="ctx-row">
              <span className="ctx-key">user.name</span>
              <span className="ctx-val hi">{user.name}</span>
            </div>
            <div className="ctx-row">
              <span className="ctx-key">user.email</span>
              <span className="ctx-val">{user.email}</span>
            </div>
            <div className="ctx-row">
              <span className="ctx-key">user._id</span>
              <span className="ctx-val">{user._id}</span>
            </div>
            <div className="ctx-row">
              <span className="ctx-key">token</span>
              <span className="ctx-val">{token?.slice(0, 50)}…</span>
            </div>
            <div className="ctx-row">
              <span className="ctx-key">localStorage</span>
              <span className="ctx-val green">token ✓ &nbsp;|&nbsp; user ✓ (persists on refresh)</span>
            </div>
          </div>

          <div className="logout-section">
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out → clears context + localStorage
            </button>
          </div>

        </main>
      </div>
    </>
  );
}