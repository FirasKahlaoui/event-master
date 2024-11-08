// Navbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css'; // Include a CSS file for styling
import { useAuth } from '../../../contexts/authContext'; // Importing user context for user data

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <Link to="/home" className="brand-logo">
                    <img src="/assets/logo.png" alt="EventMaster" /> {/* App logo */}
                    <span>EventMaster</span>
                </Link>
            </div>
            <nav className="navbar-links">
                <NavLink to="/home" activeClassName="active-link">Home</NavLink>
                <NavLink to="/my-events" activeClassName="active-link">My Events</NavLink>
                <NavLink to="/explore" activeClassName="active-link">Explore</NavLink>
            </nav>
            <div className="navbar-profile">
                <div className="profile-dropdown">
                    <img src={user.photoURL || '/assets/default-avatar.png'} alt="User Avatar" className="profile-avatar" />
                    <div className="dropdown-content">
                        <span>Hello, {user.displayName || "User"}!</span>
                        <Link to="/profile">Profile</Link>
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
