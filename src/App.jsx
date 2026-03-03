import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Purchase from "./components/Purchase.jsx";

/* ============================= */
/* 🔐 Protected Route Component  */
/* ============================= */

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // 🚫 Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role restriction
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

/* ============================= */
/* 🚀 Main App Component         */
/* ============================= */

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        {/* If already logged in → redirect to home */}
        <Route
          path="/"
          element={token ? <Navigate to="/home" replace /> : <Login />}
        />
        
        <Route path="/purchase" element={<Purchase />} />
        <Route
          path="/login"
          element={token ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/home" replace /> : <Signup />}
        />
        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/home"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
        </Route>
        {/* ================= ADMIN ROUTES ================= */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route
            path="/admin-dashboard"
            element={
              <>
                <Navbar />
                <div className="p-6 text-xl font-semibold">Admin Dashboard</div>
              </>
            }
          />
        </Route>
        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
