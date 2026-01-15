import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationAsRead } from '../services/api';
import { Home, Users, Bell, LogOut, Check, UserPlus, Heart } from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Fetch notifications every 10 seconds
    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications(user.id);
            setNotifications(response.data);
        } catch (error) { console.error(error); }
    };

    const handleRead = async (notif) => {
        if (!notif.isRead) {
            await markNotificationAsRead(notif.id);
            fetchNotifications(); // Refresh to update count
        }
        // If it's a friend request, take them to the friends page
        if (notif.type === 'FRIEND_REQUEST') {
            navigate('/friends');
            setShowNotifications(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <aside className="sidebar" >
            <Link to="/dashboard" className="sidebar-link">
                <Home size={22} /> <span>Home</span>
            </Link>

            <Link to="/friends" className="sidebar-link">
                <Users size={22} /> <span>Friends</span>
            </Link>

            {/* Notification Bell */}
            <div className="sidebar-link notification-link" style={{ cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={22} />
                <span>Notifications</span>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </div>

            {/* POP-UP WINDOW */}
            {showNotifications && (
                <div className="notification-popup">
                    <div className="popup-header">Notifications</div>
                    <div className="popup-list">
                        {notifications.length === 0 ? <p className="no-notif">No notifications</p> :
                            notifications.map(n => (
                                <div key={n.id}
                                     className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                                     onClick={() => handleRead(n)}
                                >
                                    <div className="notif-icon">
                                        {n.type === 'FRIEND_REQUEST' && <UserPlus size={16} color="#4299e1"/>}
                                        {n.type === 'LIKE' && <Heart size={16} color="#e53e3e"/>}
                                        {n.type === 'FRIEND_REQUEST_ACCEPTED' && <Check size={16} color="#48bb78"/>}
                                    </div>
                                    <div className="notif-text">{n.message}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            <button onClick={handleLogout} className="sidebar-link logout-btn">
                <LogOut size={22} /> <span>Logout</span>
            </button>
        </aside>
    );
}

export default Sidebar;