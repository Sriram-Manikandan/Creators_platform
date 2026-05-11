import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // ← context, not localStorage directly

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();   // ← login() from context handles everything

  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [errors, setErrors]             = useState({});
  const [isLoading, setIsLoading]       = useState(false);
  const [apiError, setApiError]         = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email)                       newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password)                    newErrors.password = 'Password is required';
    else if (formData.password.length < 6)     newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        // ✅ ONE line — context handles state + localStorage. No direct localStorage here!
        login(data.data, data.token);
        navigate('/dashboard');
      } else {
        setApiError(data.message || 'Login failed. Please try again.');
      }
    } catch {
      setApiError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .login-root { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; font-family: 'DM Sans', sans-serif; background: #0a0a0a; }
        .login-form-side { background: #0a0a0a; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 3rem 4rem; }
        .login-form-wrap { width: 100%; max-width: 400px; }
        .login-header { margin-bottom: 2.5rem; }
        .login-header h2 { font-family: 'DM Serif Display', serif; font-size: 2.2rem; color: #f8fafc; margin-bottom: 0.5rem; }
        .login-header p { color: #64748b; font-size: 0.9rem; }
        .login-header p a { color: #818cf8; text-decoration: none; font-weight: 500; }
        .msg-banner { padding: 12px 16px; border-radius: 10px; font-size: 0.875rem; font-weight: 500; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; }
        .msg-banner.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
        .field { margin-bottom: 1.25rem; }
        .field label { display: block; font-size: 0.78rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 1rem; pointer-events: none; opacity: 0.45; }
        .input-wrap input { width: 100%; padding: 12px 14px 12px 42px; background: #111827; border: 1px solid #1f2937; border-radius: 10px; color: #f1f5f9; font-size: 0.95rem; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
        .input-wrap input::placeholder { color: #374151; }
        .input-wrap input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .input-wrap input.has-error { border-color: #ef4444; }
        .toggle-pw { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #4b5563; font-size: 0.85rem; padding: 4px; }
        .field-error { margin-top: 6px; font-size: 0.78rem; color: #f87171; }
        .login-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; margin-top: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .login-btn:hover:not(:disabled) { opacity: 0.9; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-panel { background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 4rem; position: relative; overflow: hidden; }
        .login-panel::before { content: ''; position: absolute; top: -30%; right: -20%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%); pointer-events: none; }
        .panel-quote { font-family: 'DM Serif Display', serif; font-size: 2.4rem; line-height: 1.2; color: #f8fafc; margin-bottom: 1.5rem; position: relative; z-index: 1; }
        .panel-quote em { font-style: italic; color: #a5b4fc; }
        .panel-sub { color: #64748b; font-size: 0.9rem; line-height: 1.7; max-width: 340px; position: relative; z-index: 1; }
        @media (max-width: 768px) { .login-root { grid-template-columns: 1fr; } .login-panel { display: none; } .login-form-side { padding: 2rem 1.5rem; } }
      `}</style>

      <div className="login-root">
        <div className="login-form-side">
          <div className="login-form-wrap">
            <div className="login-header">
              <h2>Welcome back</h2>
              <p>Don&apos;t have an account? <Link to="/register">Create one here</Link></p>
            </div>

            {apiError && <div className="msg-banner error">⚠️ {apiError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input id="email" type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="jane@example.com"
                    className={errors.email ? 'has-error' : ''} autoComplete="email" />
                </div>
                {errors.email && <div className="field-error">⚠ {errors.email}</div>}
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input id="password" type={showPassword ? 'text' : 'password'}
                    name="password" value={formData.password} onChange={handleChange}
                    placeholder="Your password"
                    className={errors.password ? 'has-error' : ''} autoComplete="current-password" />
                  <button type="button" className="toggle-pw"
                    onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <div className="field-error">⚠ {errors.password}</div>}
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? <><div className="spinner" />Signing In...</> : 'Sign In →'}
              </button>
            </form>
          </div>
        </div>

        <div className="login-panel">
          <p className="panel-quote">Your ideas<br />deserve an<br /><em>audience.</em></p>
          <p className="panel-sub">Sign in to access your dashboard, manage your content, and connect with your readers.</p>
        </div>
      </div>
    </>
  );
}