import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFeed, getPendingRequests } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import FriendRequest from '../components/FriendRequest';
import './Dashboard.css';

function Dashboard() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [feedResponse, requestsResponse] = await Promise.all([
                getFeed(user.id),
                getPendingRequests(user.id)
            ]);

            setPosts(feedResponse.data);
            setFriendRequests(requestsResponse.data);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    return (
        <div className="dashboard">
            <Navbar />

            <div className="dashboard-container">
                <Sidebar />

                <main className="dashboard-main">
                    <CreatePost onPostCreated={handlePostCreated} />

                    {friendRequests.length > 0 && (
                        <div className="friend-requests-section">
                            <h3>Friend Requests</h3>
                            <div className="friend-requests-list">
                                {friendRequests.map(request => (
                                    <FriendRequest
                                        key={request.id}
                                        request={request}
                                        onUpdate={loadDashboardData}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="posts-section">
                        {loading ? (
                            <div className="loading">Loading feed...</div>
                        ) : posts.length === 0 ? (
                            <div className="empty-state">
                                <p>No posts yet. Start following friends to see their posts!</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    currentUserId={user.id}
                                    onDelete={handlePostDeleted}
                                />
                            ))
                        )}
                    </div>
                </main>

                <aside className="dashboard-aside">
                    <div className="suggestions-card">
                        <h3>Suggested Friends</h3>
                        <p className="coming-soon">Coming soon...</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Dashboard;