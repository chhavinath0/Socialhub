import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FriendRequest from '../components/FriendRequest';
import { useAuth } from '../context/AuthContext';
import api, {
    getPendingRequests,
    getFriends,
    sendFriendRequest,
    unfriend
} from '../services/api';

function Friends() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (activeTab === 'requests') loadRequests();
        if (activeTab === 'friends') loadFriends();
    }, [activeTab]);

    const loadRequests = async () => {
        try {
            const res = await getPendingRequests(user.id);
            setRequests(res.data);
        } catch (err) { console.error(err); }
    };

    const loadFriends = async () => {
        try {
            const res = await getFriends(user.id);
            setFriends(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get(`/users/search?query=${searchQuery}&currentUserId=${user.id}`);
            setSearchResults(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSendRequest = async (receiverId) => {
        try {
            await sendFriendRequest(user.id, receiverId);
            alert("Request sent!");
        } catch (err) { alert("Failed to send request"); }
    };

    const handleUnfriend = async (friendId) => {
        if(window.confirm("Are you sure?")) {
            try {
                await unfriend(user.id, friendId);
                loadFriends();
            } catch(err) { console.error(err); }
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar />
            <div style={{
                display: 'flex',
                maxWidth: '1200px',
                margin: '0 auto',
                /* ✅ FIX: 0px top padding */
                padding: '0 20px',
                gap: '20px'
            }}>
                <div style={{ width: '240px' }}>
                    <Sidebar />
                </div>

                {/* ✅ FIX: Added marginTop here to push only the white box down */}
                <div style={{
                    flex: 1,
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginTop: '20px'
                }}>

                    <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
                        <button onClick={() => setActiveTab('requests')} style={tabStyle(activeTab === 'requests')}>Requests ({requests.length})</button>
                        <button onClick={() => setActiveTab('friends')} style={tabStyle(activeTab === 'friends')}>My Friends</button>
                        <button onClick={() => setActiveTab('find')} style={tabStyle(activeTab === 'find')}>Find People</button>
                    </div>

                    {activeTab === 'requests' && (
                        <div>
                            {requests.length === 0 ? <p>No pending requests.</p> :
                                requests.map(req => (
                                    <FriendRequest key={req.id} request={{...req, receiverId: user.id, senderName: req.sender.username}} onUpdate={loadRequests} />
                                ))
                            }
                        </div>
                    )}

                    {activeTab === 'friends' && (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {friends.map(friend => (
                                <div key={friend.id} style={cardStyle}>
                                    <span>{friend.username}</span>
                                    <button onClick={() => handleUnfriend(friend.id)} style={{color: 'red'}}>Unfriend</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'find' && (
                        <div>
                            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Search username..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button type="submit" style={{ padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px' }}>Search</button>
                            </form>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {searchResults.map(u => (
                                    <div key={u.id} style={cardStyle}>
                                        <span>{u.username}</span>
                                        <button onClick={() => handleSendRequest(u.id)} style={{background: '#48bb78', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none'}}>Add Friend</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const tabStyle = (isActive) => ({
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '2px solid #667eea' : 'none',
    color: isActive ? '#667eea' : '#718096',
    fontWeight: '600',
    cursor: 'pointer'
});

const cardStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px'
};

export default Friends;