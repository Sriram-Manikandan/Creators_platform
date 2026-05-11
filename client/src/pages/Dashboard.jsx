import { Link } from 'react-router-dom';
import './Dashboard.css';

const stats = [
  { label: 'Posts Published', value: '0', icon: '📄' },
  { label: 'Total Readers', value: '0', icon: '👀' },
  { label: 'Followers', value: '0', icon: '👥' },
];

function Dashboard() {
  return (
    <main className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Your Dashboard</h1>
          <p className="dashboard-sub">
            Welcome! Manage your blog posts and track your performance here.
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <span className="stat-icon">{s.icon}</span>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Placeholder panel */}
        <div className="dashboard-panel">
          <h2>📋 Your Posts</h2>
          <div className="panel-placeholder">
            <p>No posts yet. Your published articles will appear here.</p>
            <p>
              API integration coming in an upcoming lesson —<br />
              this will connect to your Express backend.
            </p>
            <Link to="/" className="dash-btn">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;