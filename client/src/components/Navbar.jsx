import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <img 
            src="/images/logo.jpg" 
            alt="SALONQ Logo" 
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="logo-text">SALONQ</span>
        </Link>
      </div>
      <div className="nav-right">
        {user && user.role === "admin" ? (
          // For admins, show admin-specific links
          <>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/admin/bookings">All Bookings</Link>
            <Link to="/admin/services">Manage Services</Link>
            <span className="welcome">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          </>
        ) : user && user.role === "customer" ? (
          // For customers, show customer-specific links
          <>
            <Link to="/services">Services</Link>
            <Link to="/book">Book Service</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <span className="welcome">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          </>
        ) : (
          // For unauthenticated users, show all navigation on the right
          <>
            <Link to="/services">Services</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;