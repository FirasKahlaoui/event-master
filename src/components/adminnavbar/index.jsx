import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";
import { useAuth } from "../../contexts/authContext";

const AdminNavbar = () => {
  const { currentUser, logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/home");
  };

  const handleNavLinkClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/admin-dashboard" className="brand-logo">
          <span>EventMaster Admin</span>
        </Link>
      </div>
      <nav className="navbar-links">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={handleNavLinkClick}
        >
          Overview
        </NavLink>
        <NavLink
          to="/admin-events"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={handleNavLinkClick}
        >
          Events
        </NavLink>
        <NavLink
          to="/admin-users"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={handleNavLinkClick}
        >
          Users
        </NavLink>
      </nav>
      <div className="navbar-profile">
        {currentUser ? (
          <div className="profile-dropdown" ref={dropdownRef}>
            <img
              src={currentUser.photoURL || "/assets/default-avatar.png"}
              alt="Admin"
              className="profile-avatar"
              onClick={handleDropdownToggle}
            />
            {dropdownVisible && (
              <div className="dropdown-content">
                <span>Hello, {currentUser.displayName || "Admin"}!</span>
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-link">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
