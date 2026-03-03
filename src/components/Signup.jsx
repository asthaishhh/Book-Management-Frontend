// components/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockKeyhole, LockIcon, Mail, UserRound, ArrowRight } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Account created successfully!");
        navigate("/login");
      } else {
        setError(data.msg || "Signup failed");
      }
    } catch (err) {
      setError("Signup failed: " + err.message);
      console.error("Signup failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── root ── */
        .su-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Nunito', sans-serif;
          background: #ede9f7;
          position: relative;
          overflow: hidden;
        }

        /* ── aurora blobs ── */
        .su-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(72px);
          opacity: 0.55;
          pointer-events: none;
        }
        .su-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #d4b8f0 0%, #c9d4f8 60%, transparent 100%);
          top: -120px; left: -100px;
          animation: driftA 18s ease-in-out infinite alternate;
        }
        .su-blob-2 {
          width: 440px; height: 440px;
          background: radial-gradient(circle, #f9c5d1 0%, #fce4ec 60%, transparent 100%);
          bottom: -80px; right: -80px;
          animation: driftB 22s ease-in-out infinite alternate;
        }
        .su-blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #b5e8e0 0%, #c8f0ea 60%, transparent 100%);
          top: 40%; left: 60%;
          animation: driftC 16s ease-in-out infinite alternate;
        }
        .su-blob-4 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, #ffeaa7 0%, #fdf3cf 60%, transparent 100%);
          top: 20%; right: 20%;
          animation: driftD 20s ease-in-out infinite alternate;
        }

        @keyframes driftA {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.08); }
        }
        @keyframes driftB {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(-35px, -25px) scale(1.06); }
        }
        @keyframes driftC {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(-20px, 30px) scale(1.1); }
        }
        @keyframes driftD {
          0%   { transform: translate(0,0); }
          100% { transform: translate(15px, -20px); }
        }

        /* sparkle dots */
        .su-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(180,150,230,0.25) 1.5px, transparent 1.5px),
            radial-gradient(circle, rgba(240,180,200,0.2) 1px, transparent 1px);
          background-size: 52px 52px, 31px 31px;
          background-position: 0 0, 16px 16px;
          pointer-events: none;
          z-index: 1;
        }

        /* ── card ── */
        .su-card {
          position: relative;
          z-index: 10;
          width: 400px;
          background: rgba(255, 253, 255, 0.72);
          border: 1px solid rgba(210, 180, 240, 0.4);
          border-radius: 28px;
          padding: 44px 40px 40px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.6) inset,
            0 8px 0 rgba(255,255,255,0.5) inset,
            0 32px 80px rgba(160,120,200,0.18),
            0 4px 16px rgba(200,160,230,0.12);
          animation: cardFloat 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes cardFloat {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* iridescent top bar */
        .su-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 3px;
          background: linear-gradient(90deg,
            #c084fc 0%,
            #f9a8d4 25%,
            #86efac 50%,
            #7dd3fc 75%,
            #c084fc 100%
          );
          border-radius: 0 0 4px 4px;
          filter: blur(0.5px);
          opacity: 0.85;
        }

        /* ── aurora badge ── */
        .su-badge {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #d8b4fe 0%, #f9a8d4 50%, #86efac 100%);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          box-shadow:
            0 4px 16px rgba(192,132,252,0.35),
            0 0 0 4px rgba(255,255,255,0.6);
          animation: badgePulse 4s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(192,132,252,0.35), 0 0 0 4px rgba(255,255,255,0.6); }
          50%       { box-shadow: 0 6px 24px rgba(192,132,252,0.55), 0 0 0 6px rgba(255,255,255,0.4); }
        }
        .su-badge svg { color: #fff; filter: drop-shadow(0 1px 2px rgba(120,50,180,0.3)); }

        /* ── headings ── */
        .su-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 600;
          color: #3b1f5e;
          text-align: center;
          letter-spacing: -0.3px;
          line-height: 1.1;
          margin-bottom: 5px;
        }
        .su-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          text-align: center;
          font-size: 14px;
          color: #9b7bb8;
          margin-bottom: 26px;
          letter-spacing: 0.2px;
        }

        /* ── error ── */
        .su-error {
          background: rgba(255,200,220,0.35);
          border: 1px solid rgba(240,100,140,0.3);
          color: #9b2a4a;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13px;
          margin-bottom: 16px;
          text-align: center;
        }

        /* ── fields ── */
        .su-field {
          position: relative;
          margin-bottom: 13px;
        }
        .su-label {
          display: block;
          font-size: 10.5px;
          font-weight: 700;
          color: #9b7bb8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .su-field input {
          width: 100%;
          background: rgba(255,255,255,0.6);
          border: 1.5px solid rgba(196,162,230,0.4);
          border-radius: 14px;
          padding: 11px 42px 11px 15px;
          color: #3b1f5e;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .su-field input::placeholder { color: rgba(130,90,170,0.32); }
        .su-field input:focus {
          border-color: rgba(192,132,252,0.7);
          background: rgba(255,255,255,0.88);
          box-shadow:
            0 0 0 3px rgba(192,132,252,0.14),
            0 2px 8px rgba(192,132,252,0.1);
        }
        .su-field input:disabled { opacity: 0.5; cursor: not-allowed; }

        .su-field-icon {
          position: absolute;
          right: 13px;
          bottom: 12px;
          color: rgba(170,130,210,0.5);
          pointer-events: none;
          transition: color 0.2s;
        }
        .su-field:focus-within .su-field-icon { color: rgba(192,132,252,0.85); }

        /* ── divider ── */
        .su-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 16px 0 6px;
        }
        .su-divider::before, .su-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(192,132,252,0.3), transparent);
        }
        .su-divider span {
          font-size: 10px;
          color: rgba(155,123,184,0.55);
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        /* ── submit button ── */
        .su-btn {
          width: 100%;
          margin-top: 4px;
          padding: 13px;
          background: linear-gradient(135deg, #c084fc 0%, #f9a8d4 50%, #86efac 100%);
          background-size: 200% 200%;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.3px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s, background-position 0.4s;
          box-shadow:
            0 4px 20px rgba(192,132,252,0.35),
            0 0 0 1px rgba(255,255,255,0.25) inset;
          animation: shimmerReady 6s ease infinite;
          text-shadow: 0 1px 3px rgba(100,30,150,0.2);
        }
        @keyframes shimmerReady {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .su-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(192,132,252,0.45), 0 0 0 1px rgba(255,255,255,0.3) inset;
        }
        .su-btn:active:not(:disabled) { transform: translateY(0); }
        .su-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
          animation: none;
        }

        /* ── spinner ── */
        .su-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── footer ── */
        .su-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 13.5px;
          color: #9b7bb8;
        }
        .su-footer a {
          color: #a855f7;
          font-weight: 700;
          text-decoration: none;
          background: linear-gradient(90deg, #c084fc, #f9a8d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: opacity 0.2s;
        }
        .su-footer a:hover { opacity: 0.75; }
      `}</style>

      <div className="su-root">
        {/* Drifting aurora blobs */}
        <div className="su-blob su-blob-1" />
        <div className="su-blob su-blob-2" />
        <div className="su-blob su-blob-3" />
        <div className="su-blob su-blob-4" />

        <div className="su-card">
          {/* Badge */}
          <div className="su-badge">
            <UserRound size={22} />
          </div>

          <h2 className="su-title">Create account</h2>
          <p className="su-subtitle">Your journey begins here</p>

          {error && <div className="su-error">{error}</div>}

          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <div className="su-field">
              <label className="su-label">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
              <UserRound className="su-field-icon" size={15} />
            </div>

            {/* Email */}
            <div className="su-field">
              <label className="su-label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <Mail className="su-field-icon" size={15} />
            </div>

            {/* Password */}
            <div className="su-field">
              <label className="su-label">Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <LockIcon className="su-field-icon" size={15} />
            </div>

            {/* Confirm Password */}
            <div className="su-field">
              <label className="su-label">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <LockKeyhole className="su-field-icon" size={15} />
            </div>

            <div className="su-divider"><span>secure & private</span></div>

            {/* Submit */}
            <button type="submit" className="su-btn" disabled={loading}>
              {loading ? (
                <><div className="su-spinner" /> Creating account…</>
              ) : (
                <>Create account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="su-footer">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;