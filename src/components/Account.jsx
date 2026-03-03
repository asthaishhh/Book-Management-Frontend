import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const user = JSON.parse(localStorage.getItem("user"));

const Account = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        /*
          All sizes derive from --nav-h set on .aurora-nav in Navbar.jsx.
          Fallback to 60px so Account works standalone too.
          Avatar = 68% of nav height  →  fits with vertical padding to spare.
        */
        .account-wrap {
          --nav-h: var(--aurora-nav-h, 60px);
          --avatar-size: calc(var(--nav-h) * 0.68);
          --font-name: calc(var(--nav-h) * 0.22);
          --font-badge: calc(var(--nav-h) * 0.14);
          --font-btn: calc(var(--nav-h) * 0.18);

          display: flex;
          align-items: center;
          gap: calc(var(--nav-h) * 0.18);
          padding: calc(var(--nav-h) * 0.1) 0;
          font-family: 'Nunito', sans-serif;
          /* stretch to fill whatever height the nav row gives it */
          height: 100%;
        }

        /* ── avatar ── */
        .account-avatar-ring {
          position: relative;
          flex-shrink: 0;
          width: var(--avatar-size);
          height: var(--avatar-size);
          border-radius: 50%;
          background: linear-gradient(135deg, #c084fc, #f9a8d4, #86efac, #7dd3fc);
          background-size: 300% 300%;
          animation: ringShift 4s linear infinite;
          /* ring thickness = ~5% of avatar size */
          padding: calc(var(--avatar-size) * 0.055);
          box-shadow: 0 0 14px rgba(192,132,252,0.45);
        }
        @keyframes ringShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .account-avatar-img {
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
          object-position: top;
          border: 2px solid rgba(88,28,135,0.9);
          display: block;
        }

        /* online dot — 18% of avatar size */
        .account-online-dot {
          position: absolute;
          bottom: calc(var(--avatar-size) * 0.03);
          right: calc(var(--avatar-size) * 0.03);
          width: calc(var(--avatar-size) * 0.18);
          height: calc(var(--avatar-size) * 0.18);
          background: #86efac;
          border-radius: 50%;
          border: 2px solid rgba(88,28,135,0.95);
          box-shadow: 0 0 6px rgba(134,239,172,0.7);
        }

        /* ── text info ── */
        .account-info {
          display: flex;
          flex-direction: column;
          gap: calc(var(--nav-h) * 0.04);
          min-width: 0;
        }
        .account-name {
          font-size: clamp(11px, var(--font-name), 16px);
          font-weight: 800;
          color: #fff;
          line-height: 1;
          white-space: nowrap;
          letter-spacing: 0.1px;
          text-shadow: 0 1px 4px rgba(60,10,100,0.4);
        }
        .account-role-badge {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          font-size: clamp(8px, var(--font-badge), 11px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: calc(var(--nav-h) * 0.03) calc(var(--nav-h) * 0.1);
          border-radius: 999px;
          background: linear-gradient(135deg, #f9a8d4, #c084fc);
          color: #fff;
          box-shadow: 0 2px 8px rgba(192,132,252,0.35);
        }

        /* ── message button ── */
        .account-msg-btn {
          display: flex;
          align-items: center;
          gap: calc(var(--nav-h) * 0.06);
          padding: calc(var(--nav-h) * 0.07) calc(var(--nav-h) * 0.17);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.85);
          font-family: 'Nunito', sans-serif;
          font-size: clamp(10px, var(--font-btn), 13px);
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
          backdrop-filter: blur(8px);
          flex-shrink: 0;
        }
        .account-msg-btn:hover {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(192,132,252,0.3);
          color: #fff;
        }
        .account-msg-btn:active { transform: translateY(0); }
      `}</style>

      <div className="account-wrap">
        {/* Avatar with animated iridescent ring */}
        <div className="account-avatar-ring">
          <img
            className="account-avatar-img"
            src="https://static.vecteezy.com/system/resources/thumbnails/050/944/576/small/portrait-close-up-woman-face-wearing-scarf-black-and-white-tone-dramatic-effect-photo.JPG"
            alt="Profile"
          />
          <div className="account-online-dot" />
        </div>

        {/* Name + role */}
        <div className="account-info">
          {user ? (
            <>
              <span className="account-name">{user.name}</span>
              <span className="account-role-badge">{user.role}</span>
            </>
          ) : (
            <span className="account-name">Astha Patel</span>
          )}
        </div>

        {/* Message button */}
        <button className="account-msg-btn">
          <MessageCircle size={12} />
          Message
        </button>
      </div>
    </>
  );
};

export default Account;