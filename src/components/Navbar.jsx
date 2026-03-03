// components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { SquareMenu, Home, Info, Mail, LogOut, LayoutDashboard, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Account from "./Account";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  /* ============================= */
  /* 🔐 Safe User Parsing          */
  /* ============================= */
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const user = getUser();

  /* ============================= */
  /* 🚪 Logout                     */
  /* ============================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ============================= */
  /* 📌 Close on Outside Click     */
  /* ============================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ============================= */
  /* 🎨 UI                         */
  /* ============================= */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,600;1,500&display=swap');

        /* ── navbar bar ── */
        .aurora-nav {
          --aurora-nav-h: 60px;          /* ← single source of truth for height */
          position: relative;
          font-family: 'Nunito', sans-serif;
          background: linear-gradient(135deg,
            rgba(88, 28, 135, 0.97) 0%,
            rgba(109, 40, 217, 0.93) 30%,
            rgba(147, 51, 234, 0.92) 60%,
            rgba(168, 85, 247, 0.95) 100%
          );
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(216, 180, 254, 0.2);
          padding: 0 24px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08) inset,
            0 4px 24px rgba(88, 28, 135, 0.35),
            0 2px 8px rgba(168, 85, 247, 0.2);
        }

        /* iridescent shimmer stripe across top */
        .aurora-nav::before {
          content: '';
          position: absolute;
          top: 0; left: 8%; right: 8%;
          height: 2px;
          background: linear-gradient(90deg,
            #c084fc, #f9a8d4, #86efac, #7dd3fc, #f9a8d4, #c084fc
          );
          background-size: 200% 100%;
          border-radius: 0 0 4px 4px;
          animation: stripeShift 4s linear infinite;
          opacity: 0.9;
        }
        @keyframes stripeShift {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        /* ── top row ── */
        .aurora-nav-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: var(--aurora-nav-h);
          padding: 8px 0;
          gap: 12px;
        }

        /* ── menu toggle button ── */
        .nav-menu-btn {
          width: 38px; height: 38px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
          color: #fff;
          flex-shrink: 0;
        }
        .nav-menu-btn:hover {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.35);
          transform: scale(1.08);
          box-shadow: 0 0 16px rgba(216,180,254,0.4);
        }
        .nav-menu-btn.active {
          background: rgba(255,255,255,0.2);
          box-shadow: 0 0 20px rgba(216,180,254,0.5);
        }

        /* ── dropdown ── */
        .aurora-dropdown {
          margin-top: 6px;
          background: linear-gradient(160deg,
            rgba(60, 10, 110, 0.97) 0%,
            rgba(45, 8, 88, 0.98) 100%
          );
          border: 1px solid rgba(192,132,252,0.28);
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 16px 48px rgba(30, 5, 70, 0.55),
            0 0 32px rgba(168,85,247,0.15);
          animation: dropIn 0.28s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* thin rainbow rule at top of dropdown */
        .aurora-dropdown::before {
          content: '';
          display: block;
          height: 2px;
          background: linear-gradient(90deg, #c084fc, #f9a8d4, #86efac, #7dd3fc);
          opacity: 0.7;
        }

        /* ── menu items ── */
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 20px;
          cursor: pointer;
          transition: background 0.18s, padding-left 0.18s;
          border-bottom: 1px solid rgba(192,132,252,0.08);
          position: relative;
          overflow: hidden;
        }
        .nav-item:last-child { border-bottom: none; }

        /* shimmer on hover */
        .nav-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, #c084fc, #f9a8d4);
          transform: scaleY(0);
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1);
          border-radius: 0 2px 2px 0;
        }
        .nav-item:hover::before { transform: scaleY(1); }
        .nav-item:hover {
          background: rgba(192,132,252,0.1);
          padding-left: 26px;
        }

        .nav-item-icon {
          width: 32px; height: 32px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .nav-item:hover .nav-item-icon { transform: scale(1.1); }

        .nav-item-icon.purple {
          background: rgba(192,132,252,0.18);
          border: 1px solid rgba(192,132,252,0.3);
          color: #d8aaff;
        }
        .nav-item-icon.pink {
          background: rgba(249,168,212,0.15);
          border: 1px solid rgba(249,168,212,0.28);
          color: #ffb3cc;
        }
        .nav-item-icon.teal {
          background: rgba(134,239,172,0.12);
          border: 1px solid rgba(134,239,172,0.25);
          color: #86efac;
        }
        .nav-item-icon.red {
          background: rgba(249,100,140,0.12);
          border: 1px solid rgba(249,100,140,0.25);
          color: #ff6b9d;
        }
        .nav-item-icon.amber {
          background: rgba(251,191,36,0.12);
          border: 1px solid rgba(251,191,36,0.25);
          color: #fbbf24;
        }

        .nav-item-label {
          font-size: 14px;
          font-weight: 700;
          color: rgba(240,228,255,0.88);
          transition: color 0.18s;
          letter-spacing: 0.1px;
        }
        .nav-item:hover .nav-item-label { color: #f0e6ff; }

        .nav-item-label.danger { color: rgba(255,140,170,0.85); }
        .nav-item:hover .nav-item-label.danger { color: #ff6b9d; }

        .nav-item-label.admin {
          background: linear-gradient(90deg, #fbbf24, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* admin badge */
        .admin-badge {
          margin-left: auto;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 2px 8px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316, #fbbf24);
          color: #fff;
          flex-shrink: 0;
        }
      `}</style>

      <div className="aurora-nav" ref={menuRef}>
        {/* Top row */}
        <div className="aurora-nav-row">
          {/* Left: Account component */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Account />
          </div>

          {/* Right: menu toggle */}
          <button
            className={`nav-menu-btn${open ? " active" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <SquareMenu size={18} />}
          </button>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="aurora-dropdown">
            {/* Home */}
            <div
              className="nav-item"
              onClick={() => { navigate("/home"); setOpen(false); }}
            >
              <div className="nav-item-icon purple"><Home size={15} /></div>
              <span className="nav-item-label">Home</span>
            </div>

            {/* Admin Dashboard — role-gated */}
            {user?.role === "Admin" && (
              <div
                className="nav-item"
                onClick={() => { navigate("/admin-dashboard"); setOpen(false); }}
              >
                <div className="nav-item-icon amber"><LayoutDashboard size={15} /></div>
                <span className="nav-item-label admin">Admin Dashboard</span>
                <span className="admin-badge">Admin</span>
              </div>
            )}

            {/* About */}
            <div
              className="nav-item"
              onClick={() => setOpen(false)}
            >
              <div className="nav-item-icon teal"><Info size={15} /></div>
              <span className="nav-item-label">About</span>
            </div>

            {/* Contact */}
            <div
              className="nav-item"
              onClick={() => setOpen(false)}
            >
              <div className="nav-item-icon pink"><Mail size={15} /></div>
              <span className="nav-item-label">Contact</span>
            </div>

            {/* Logout */}
            <div className="nav-item" onClick={handleLogout}>
              <div className="nav-item-icon red"><LogOut size={15} /></div>
              <span className="nav-item-label danger">Logout</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;