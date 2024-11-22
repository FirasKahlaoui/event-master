import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../contexts/authContext";

const Navbar = () => {
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
        <Link to="/home" className="brand-logo">
          <span>EventMaster</span>
        </Link>
      </div>
      <nav className="navbar-links">
        <NavLink
          to="/home"
          activeClassName="active-link"
          onClick={handleNavLinkClick}
        >
          Home
        </NavLink>
        <NavLink
          to="/my-events"
          activeClassName="active-link"
          onClick={handleNavLinkClick}
        >
          My Events
        </NavLink>
        <NavLink
          to="/explore"
          activeClassName="active-link"
          onClick={handleNavLinkClick}
        >
          Explore
        </NavLink>
      </nav>
      <div className="navbar-profile">
        {currentUser ? (
          <div className="profile-dropdown" ref={dropdownRef}>
            <img
              src={currentUser.photoURL || "/assets/default-avatar.png"}
              alt="User Avatar"
              className="profile-avatar"
              onClick={handleDropdownToggle}
            />
            {dropdownVisible && (
              <div className="dropdown-content">
                <span>Hello, {currentUser.displayName || "User"}!</span>
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

export default Navbar;
