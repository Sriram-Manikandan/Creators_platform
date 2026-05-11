import { Link } from 'react-router-dom';
import './Auth.css';

function Login() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to your BlogHub account</p>

        <div className="auth-placeholder">
          <span>🔐</span>
          <p>Login form will be implemented in an upcoming lesson.</p>
          <p>This page will include Email & Password fields connected to the backend API.</p>
        </div>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;