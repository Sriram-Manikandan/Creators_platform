import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ─── Handle Input Change ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ─── Client-Side Validation ────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Form Submission ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password,
          // confirmPassword is NOT sent to the backend
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(
          "Account created successfully! Redirecting to login..."
        );
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setApiError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setApiError("Unable to connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Password strength helper ──────────────────────────────────────────────
  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Too short", color: "#ef4444", width: "20%" };
    if (p.length < 8) return { label: "Weak", color: "#f97316", width: "40%" };
    if (p.length < 12 && /[A-Z]/.test(p)) return { label: "Fair", color: "#eab308", width: "60%" };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: "Strong", color: "#22c55e", width: "85%" };
    return { label: "Good", color: "#3b82f6", width: "65%" };
  };

  const strength = getPasswordStrength();

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
        }

        /* ── Left Panel ── */
        .reg-panel {
          background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 4rem;
          position: relative;
          overflow: hidden;
        }
        .reg-panel::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .reg-panel::after {
          content: '';
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .panel-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 2rem;
        }
        .panel-badge span { width: 6px; height: 6px; background: #818cf8; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .panel-title {
          font-family: 'DM Serif Display', serif;
          font-size: 3.2rem;
          line-height: 1.1;
          color: #f8fafc;
          margin-bottom: 1.5rem;
        }
        .panel-title em { font-style: italic; color: #a5b4fc; }
        .panel-desc {
          font-size: 1rem;
          color: #94a3b8;
          line-height: 1.7;
          max-width: 360px;
          margin-bottom: 3rem;
        }
        .panel-features { display: flex; flex-direction: column; gap: 1rem; position: relative; z-index: 1; }
        .panel-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #cbd5e1;
          font-size: 0.9rem;
        }
        .feature-icon {
          width: 36px; height: 36px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        /* ── Right Panel (Form) ── */
        .reg-form-side {
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 4rem;
          overflow-y: auto;
        }
        .reg-form-wrap {
          width: 100%;
          max-width: 420px;
        }
        .reg-form-header { margin-bottom: 2.5rem; }
        .reg-form-header h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          color: #f8fafc;
          margin-bottom: 0.5rem;
        }
        .reg-form-header p { color: #64748b; font-size: 0.9rem; }
        .reg-form-header p a { color: #818cf8; text-decoration: none; font-weight: 500; }
        .reg-form-header p a:hover { text-decoration: underline; }

        /* Banner messages */
        .msg-banner {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .msg-banner.success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #86efac; }
        .msg-banner.error   { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.3);  color: #fca5a5; }

        /* Field */
        .field { margin-bottom: 1.25rem; }
        .field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute;
          left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 1rem;
          pointer-events: none;
          opacity: 0.5;
        }
        .input-wrap input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 10px;
          color: #f1f5f9;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .input-wrap input::placeholder { color: #374151; }
        .input-wrap input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
        .input-wrap input.has-error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
        }
        .toggle-pw {
          position: absolute;
          right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #4b5563; font-size: 0.85rem; padding: 4px;
          transition: color 0.2s;
        }
        .toggle-pw:hover { color: #9ca3af; }
        .field-error {
          margin-top: 6px;
          font-size: 0.78rem;
          color: #f87171;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Password strength */
        .pw-strength { margin-top: 8px; }
        .pw-strength-bar {
          height: 3px;
          background: #1f2937;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .pw-strength-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s, background 0.3s;
        }
        .pw-strength-label { font-size: 0.75rem; color: #6b7280; }

        /* Submit button */
        .reg-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .reg-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          text-align: center;
          color: #374151;
          font-size: 0.8rem;
          margin: 1.5rem 0 0;
          position: relative;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .reg-root { grid-template-columns: 1fr; }
          .reg-panel { display: none; }
          .reg-form-side { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="reg-root">
        {/* ── Left decorative panel ── */}
        <div className="reg-panel">
          <div className="panel-badge">
            <span></span> Creator's Platform
          </div>
          <h1 className="panel-title">
            Share your<br /><em>story</em> with<br />the world
          </h1>
          <p className="panel-desc">
            Join thousands of creators publishing, connecting, and growing their
            audience every day.
          </p>
          <div className="panel-features">
            {[
              { icon: "✍️", text: "Publish articles and posts instantly" },
              { icon: "📈", text: "Track your audience and growth" },
              { icon: "🔒", text: "Your data, always secure" },
            ].map((f) => (
              <div className="panel-feature" key={f.text}>
                <div className="feature-icon">{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="reg-form-side">
          <div className="reg-form-wrap">
            <div className="reg-form-header">
              <h2>Create account</h2>
              <p>
                Already have an account?{" "}
                <Link to="/login">Sign in here</Link>
              </p>
            </div>

            {/* API Success */}
            {successMessage && (
              <div className="msg-banner success">✅ {successMessage}</div>
            )}

            {/* API Error */}
            {apiError && (
              <div className="msg-banner error">⚠️ {apiError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className={errors.name ? "has-error" : ""}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <div className="field-error">⚠ {errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className={errors.email ? "has-error" : ""}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <div className="field-error">⚠ {errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={errors.password ? "has-error" : ""}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* Strength indicator */}
                {formData.password && strength && (
                  <div className="pw-strength">
                    <div className="pw-strength-bar">
                      <div
                        className="pw-strength-fill"
                        style={{ width: strength.width, background: strength.color }}
                      />
                    </div>
                    <span className="pw-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <div className="field-error">⚠ {errors.password}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔑</span>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={errors.confirmPassword ? "has-error" : ""}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="field-error">⚠ {errors.confirmPassword}</div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" className="reg-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>

            <div className="divider">
              By registering you agree to our Terms & Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </>
  );
}