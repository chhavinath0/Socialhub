import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotifications } from '../services/api';
import { Home, Users, Bell, LogOut } from 'lucide-react';
import './Sidebar.css';
import postCard from "./PostCard.jsx";

function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications(user.id);
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <aside className="sidebar">
            <Link to="/dashboard" className="sidebar-link">
                <Home size={22} /> <span>Home</span>
            </Link>

            <Link to="/friends" className="sidebar-link">
                <Users size={22} /> <span>Friends</span>
            </Link>

            <div className="sidebar-link notification-link">
                <button onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell size={22} />
                    {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount}</span>
                    )}
                </button>
            </div>
            <button onClick={postCard} className="sidebar-link post-card">
                <span>Post</span>


            </button>

            <button onClick={handleLogout} className="sidebar-link logout-btn">
                <LogOut size={22} /> <span>Logout</span>
            </button>
        </aside>
    );
}

export default Sidebar;
