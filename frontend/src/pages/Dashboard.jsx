import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { getFeed } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetchFeed();
        }
    }, [user]);

    const fetchFeed = async () => {
        try {
            const response = await getFeed(user.id);
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to load feed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = (newPost) => {
        const postWithUser = {
            ...newPost,
            authorName: user.fullName || user.username,
            user: user,
            authorId: user.id,
            likesCount: 0,
            commentsCount: 0,
            likedByCurrentUser: false
        };
        setPosts([postWithUser, ...posts]);
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(p => p.id !== postId));
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar />

            <div style={{
                display: 'flex',
                maxWidth: '1200px',
                margin: '0 auto',
                /* ✅ FIX: 0px top/bottom padding, 20px left/right */
                padding: '0 20px',
                gap: '20px'
            }}>
                {/* Sidebar Column */}
                <div style={{ width: '240px', flexShrink: 0 ,marginTop:'-20px'}}>
                    <Sidebar />
                </div>

                {/* Feed Column */}
                {/* ✅ FIX: Added paddingTop here instead so Sidebar isn't pushed down */}
                <div style={{ flex: 1, maxWidth: '600px', paddingTop: '20px' }}>
                    <CreatePost onPostCreated={handlePostCreated} />

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {loading ? (
                            <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading feed...</p>
                        ) : posts.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                                No posts yet. Add friends or write your first post!
                            </p>
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
                </div>

                {/* Right Spacer Column */}
                <div style={{ width: '280px', display: 'none', '@media (min-width: 1000px)': { display: 'block' } }}></div>
            </div>
        </div>
    );
}

export default Dashboard;





