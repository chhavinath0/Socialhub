

import React, { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import './Profile.css';
import { updateProfilePicture } from '../services/api';
import {
    getUserById,
    getUserPosts,
    getSavedPosts,
    sendFriendRequest,
    unfriend
} from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';



function Profile() {
    const { userId } = useParams();
    const profileUserId = Number(userId);
    const navigate = useNavigate();

    const { user: currentUser } = useAuth();
    const { feed, setFeed } = usePosts();


    const isOwnProfile = currentUser?.id === profileUserId;

    /* ---------------- STATE ---------------- */
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('POSTS');
    const [loading, setLoading] = useState(true);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [showPicActions, setShowPicActions] = useState(false);

    /* ---------------- LOAD PROFILE ---------------- */
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);

                // 1. Load user
                const userRes = await getUserById(profileUserId);
                setProfileUser(userRes.data);

                // 2. Load posts
                const postsRes = await getUserPosts(profileUserId, currentUser.id);
                setPosts(postsRes.data);

                // 3. Load saved posts (only own profile)
                if (isOwnProfile) {
                    const savedRes = await getSavedPosts(currentUser.id);
                    setSavedPosts(savedRes.data);
                }

            } catch (err) {
                console.error('Failed to load profile', err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) loadProfile();
    }, [profileUserId, currentUser, isOwnProfile]);

    /* ---------------- HANDLERS ---------------- */
    const handleSendFriendRequest = async () => {
        try {
            await sendFriendRequest(currentUser.userId, profileUser.userId);
            alert('Friend request sent');
        } catch (err) {
            alert('Failed to send friend request');
        }
    };

    const handleUnfriend = async () => {
        if (!window.confirm('Unfriend this user?')) return;
        try {
            await unfriend(currentUser.userId, profileUser.userId);
            alert('Unfriended');
        } catch (err) {
            console.error(err);
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setNewProfilePic(file);
        setProfilePicPreview(URL.createObjectURL(file));
        setShowPicActions(true);
    };

    const saveProfilePic = async () => {
        if (!newProfilePic) return;
        try {
            const res = await updateProfilePicture(currentUser.id, newProfilePic);
            setProfileUser(prev => ({
                ...prev,
                profilePicture: res.data.profilePictureUrl // use backend response URL
            }));
            setNewProfilePic(null);
            setProfilePicPreview(null);
            setShowPicActions(false);
            alert('Profile picture updated!');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile picture');
        }
    };

    const cancelProfilePic = () => {
        setNewProfilePic(null);
        setProfilePicPreview(null);
        setShowPicActions(false);
    };

    const handlePostCreated = (newPost) => {
        // 1. Add to own profile posts
        setPosts(prev => [newPost, ...prev]);
        // 2. Add to global feed
        setFeed(prev => [newPost, ...prev]);
    };

    /* ---------------- LOADING ---------------- */
    if (loading || !profileUser) {
        return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading profile...</p>;
    }

    /* ---------------- RENDER ---------------- */
    return (
        <div className="profile-page">
            {/* HEADER */}
            <button
                className="back-btn"
                onClick={() => navigate('/')}
            >
                ← Back
            </button>

            <div className="profile-header">
                <div className="profile-pic">
                    <img
                        src={profilePicPreview || profileUser?.profilePicture || '/default-avatar.png'}
                        alt="profile"
                    />
                    {isOwnProfile && (
                        <>
                            <label className="change-photo-btn">
                                Change photo
                                <input type="file" accept="image/*" hidden onChange={handleProfilePicChange} />
                            </label>

                            {showPicActions && (
                                <div className="profile-pic-actions">
                                    <button onClick={saveProfilePic} className="primary-btn">Save</button>
                                    <button onClick={cancelProfilePic} className="secondary-btn">Cancel</button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="profile-info">
                    <h2>{profileUser.username}</h2>
                    <h4>{profileUser.fullName}</h4>
                    <p className="bio">{profileUser.bio}</p>

                    {!isOwnProfile && (
                        <div className="profile-actions">
                            <button className="primary-btn" onClick={handleSendFriendRequest}>Add Friend</button>
                            <button className="danger-btn" onClick={handleUnfriend}>Unfriend</button>
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE POST (OWN PROFILE ONLY) */}
            {isOwnProfile && (
                <CreatePost onPostCreated={handlePostCreated} />
            )}

            {/* TABS */}
            <div className="profile-tabs">
                <button className={activeTab === 'POSTS' ? 'active' : ''} onClick={() => setActiveTab('POSTS')}>Posts</button>
                {isOwnProfile && (
                    <button className={activeTab === 'SAVED' ? 'active' : ''} onClick={() => setActiveTab('SAVED')}>Saved</button>
                )}
            </div>

            {/* CONTENT */}
            <div className="profile-content">
                {activeTab === 'POSTS' &&
                    posts.map(post => (
                        <PostCard key={post.id} post={post} currentUserId={currentUser.id} />
                    ))
                }
                {activeTab === 'SAVED' &&
                    savedPosts.map(post => (
                        <PostCard key={post.id} post={post} currentUserId={currentUser.id} />
                    ))
                }
            </div>
        </div>
    );
}

export default Profile;
