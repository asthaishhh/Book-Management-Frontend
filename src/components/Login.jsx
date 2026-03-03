

// components/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hideTimer = React.useRef(null);

  const navigate = useNavigate();

  /* ============================= */
  /* 👁️ Toggle Password Visibility  */
  /* ============================= */
  const handleShowPassword = () => {
    // Clear any existing timer
    if (hideTimer.current) clearTimeout(hideTimer.current);

    setShowPassword(true);

    // Auto-hide after 3 seconds
    hideTimer.current = setTimeout(() => {
      setShowPassword(false);
    }, 3000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, []);

  /* ============================= */
  /* 🔐 Redirect if Already Logged */
  /* ============================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  /* ============================= */
  /* 🚀 Handle Login               */
  /* ============================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Please fill all fields.");
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid server response");
      }

      // Store token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Logged in successfully ✅");

      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ============================= */
  /* 🎨 UI                         */
  /* ============================= */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Lora:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── root / background ── */
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Jost', sans-serif;
          background-color: #f5f0e8;
          position: relative;
          overflow: hidden;
        }

        /* warm paper texture via subtle noise gradient */
        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 55% at 15% 15%, rgba(193,154,107,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 85% 85%, rgba(160,120,70,0.13) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 50% 50%, rgba(245,235,215,0.5) 0%, transparent 65%);
          animation: warmPulse 14s ease-in-out infinite alternate;
        }

        @keyframes warmPulse {
          0%   { transform: scale(1); }
          100% { transform: scale(1.04); }
        }

        /* fine dot-grid — editorial grid lines */
        .login-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(100,70,30,0.12) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── decorative rule lines (flanking the card) ── */
        .deco-lines {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        .deco-lines::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0; bottom: 0;
          transform: translateX(-280px);
          width: 1px;
          background: linear-gradient(to bottom, transparent 0%, rgba(139,90,43,0.18) 20%, rgba(139,90,43,0.18) 80%, transparent 100%);
        }
        .deco-lines::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 0; bottom: 0;
          transform: translateX(280px);
          width: 1px;
          background: linear-gradient(to bottom, transparent 0%, rgba(139,90,43,0.18) 20%, rgba(139,90,43,0.18) 80%, transparent 100%);
        }

        /* ── card ── */
        .login-card {
          position: relative;
          z-index: 10;
          width: 390px;
          background: #fdf8f0;
          border: 1px solid rgba(139,90,43,0.18);
          border-radius: 4px;
          padding: 50px 44px 44px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.9) inset,
            4px 4px 0 rgba(139,90,43,0.08),
            0 24px 60px rgba(80,50,20,0.13);
          animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* top ornamental rule */
        .card-rule {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        .card-rule::before, .card-rule::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(139,90,43,0.4));
        }
        .card-rule::after {
          background: linear-gradient(to left, transparent, rgba(139,90,43,0.4));
        }
        .card-rule-diamond {
          width: 6px; height: 6px;
          background: #8b5a2b;
          transform: rotate(45deg);
          flex-shrink: 0;
          opacity: 0.6;
        }

        /* ── badge ── */
        .badge {
          width: 48px; height: 48px;
          background: #2c1a0e;
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          box-shadow: 2px 2px 0 rgba(139,90,43,0.3);
        }
        .badge svg { color: #f5f0e8; }

        /* ── headings ── */
        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 900;
          color: #1a0f07;
          text-align: center;
          letter-spacing: -0.3px;
          line-height: 1.15;
          margin-bottom: 6px;
        }
        .login-subtitle {
          font-family: 'Lora', serif;
          font-style: italic;
          text-align: center;
          font-size: 13px;
          color: #8b6e50;
          margin-bottom: 30px;
          letter-spacing: 0.2px;
        }

        /* ── error ── */
        .error-box {
          background: #fff5f5;
          border: 1px solid rgba(180,50,50,0.25);
          border-left: 3px solid #b03030;
          color: #922020;
          padding: 10px 14px;
          border-radius: 2px;
          font-size: 13px;
          margin-bottom: 18px;
          font-family: 'Lora', serif;
          font-style: italic;
        }

        /* ── fields ── */
        .field {
          position: relative;
          margin-bottom: 16px;
        }
        .field-label {
          display: block;
          font-size: 10.5px;
          font-weight: 500;
          color: #6b4f32;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 7px;
          font-family: 'Jost', sans-serif;
        }
        .field input {
          width: 100%;
          background: #faf5ec;
          border: 1px solid rgba(139,90,43,0.28);
          border-radius: 2px;
          padding: 11px 44px 11px 14px;
          color: #1a0f07;
          font-family: 'Jost', sans-serif;
          font-size: 14.5px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .field input::placeholder { color: rgba(100,70,40,0.32); }
        .field input:focus {
          border-color: rgba(139,90,43,0.65);
          background: #fffdf7;
          box-shadow: 0 0 0 3px rgba(139,90,43,0.1), inset 0 1px 2px rgba(139,90,43,0.06);
        }
        .field input:disabled { opacity: 0.5; cursor: not-allowed; }

        .field-icon {
          position: absolute;
          right: 13px;
          bottom: 12px;
          color: rgba(139,90,43,0.35);
          pointer-events: none;
          transition: color 0.2s;
        }
        .field:focus-within .field-icon { color: rgba(139,90,43,0.7); }

        /* ── eye toggle ── */
        .field-icons {
          position: absolute;
          right: 12px;
          bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .eye-btn {
          background: none;
          border: none;
          padding: 2px;
          cursor: pointer;
          color: rgba(139,90,43,0.35);
          display: flex;
          align-items: center;
          transition: color 0.2s, transform 0.15s;
          border-radius: 2px;
        }
        .eye-btn:hover { color: #8b5a2b; transform: scale(1.1); }
        .eye-btn:active { transform: scale(0.95); }
        .eye-btn.active { color: #5a3010; }

        /* ── divider ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0 8px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(139,90,43,0.2);
        }
        .divider span {
          font-size: 10px;
          color: rgba(100,70,40,0.45);
          text-transform: uppercase;
          letter-spacing: 1.4px;
          font-family: 'Jost', sans-serif;
        }

        /* ── submit button ── */
        .btn-login {
          width: 100%;
          margin-top: 6px;
          padding: 13px;
          background: #2c1a0e;
          color: #f5f0e8;
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 2px 2px 0 rgba(139,90,43,0.35);
        }
        .btn-login:hover:not(:disabled) {
          background: #3d2512;
          transform: translateY(-1px);
          box-shadow: 3px 4px 0 rgba(139,90,43,0.3);
        }
        .btn-login:active:not(:disabled) {
          transform: translateY(1px);
          box-shadow: 1px 1px 0 rgba(139,90,43,0.3);
        }
        .btn-login:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* ── spinner ── */
        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(245,240,232,0.3);
          border-top-color: #f5f0e8;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── footer ── */
        .login-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 13px;
          color: #8b6e50;
          font-family: 'Lora', serif;
          font-style: italic;
        }
        .login-footer a {
          color: #5a3010;
          text-decoration: underline;
          text-decoration-style: dotted;
          text-underline-offset: 3px;
          font-weight: 500;
          transition: color 0.2s;
          font-style: normal;
        }
        .login-footer a:hover { color: #2c1a0e; text-decoration-style: solid; }
      `}</style>

      <div className="login-root">
        <div className="deco-lines" />
        <div className="login-card">

          {/* Ornamental rule */}
          <div className="card-rule">
            <div className="card-rule-diamond" />
          </div>

          {/* Icon badge */}
          <div className="badge">
            <LockKeyhole size={20} />
          </div>

          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to continue to your account</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="field">
              <label className="field-label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <Mail className="field-icon" size={15} />
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "72px" }}
                required
                disabled={loading}
              />
              <div className="field-icons">
                <button
                  type="button"
                  className={`eye-btn${showPassword ? " active" : ""}`}
                  onClick={handleShowPassword}
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password (3s)"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <LockKeyhole size={14} style={{ color: "rgba(139,90,43,0.32)", pointerEvents: "none" }} />
              </div>
            </div>

            <div className="divider"><span>secure login</span></div>

            {/* Submit */}
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <><div className="spinner" /> Logging in…</>
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;