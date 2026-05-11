import { Link } from 'react-router-dom';
import './Auth.css';

function Register() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join the BlogHub community today</p>

        <div className="auth-placeholder">
          <span>📝</span>
          <p>Registration form will be implemented in an upcoming lesson.</p>
          <p>This page will include Name, Email & Password fields with validation.</p>
        </div>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;