import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Search } from 'lucide-react';
import './Navbar.css';

function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Brand */}
                <Link to="/dashboard" className="navbar-brand">
                    <span className="brand-icon">brand_icon</span>
                    <span className="brand-text">Socialhub</span>
                </Link>

                {/* Search Bar */}
                <div className="navbar-search">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="search-input"
                    />
                </div>

                {/* Profile */}
                <Link to={`/profile/${user?.id}`} className="nav-link profile-link">
                    <User size={22} />
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
