// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import {
//     getUserById,
//     getUserPosts,
//     getSavedPosts,
//     getSharedPosts,
//     sendFriendRequest,
//     unfriend,
//     getFriends
// } from '../services/api';
// import Navbar from '../components/Navbar';
// import {
//     Grid3x3,
//     Bookmark,
//     Share2,
//     Settings,
//     UserPlus,
//     UserMinus,
//     Image
// } from 'lucide-react';
// import './Profile.css';
//
// function Profile() {
//     const { userId } = useParams();
//     const { user: currentUser, loading: authLoading } = useAuth();
//
//     // ----- State -----
//     const [profileUser, setProfileUser] = useState(null);
//     const [posts, setPosts] = useState([]);
//     const [savedPosts, setSavedPosts] = useState([]);
//     const [sharedPosts, setSharedPosts] = useState([]);
//     const [friends, setFriends] = useState([]);
//     const [activeTab, setActiveTab] = useState('posts');
//     const [loading, setLoading] = useState(true);
//     const [isFriend, setIsFriend] = useState(false);
//     const [friendRequestSent, setFriendRequestSent] = useState(false);
//
//     const isOwnProfile = currentUser?.id === parseInt(userId);
//
//     // ----- Load Profile Data -----
//     useEffect(() => {
//         const loadProfileData = async () => {
//             if (!currentUser) return;
//
//             try {
//                 setLoading(true);
//
//                 const userRes = await getUserById(userId);
//                 setProfileUser(userRes.data);
//
//                 const postsRes = await getUserPosts(userId, currentUser.id);
//                 setPosts(postsRes.data);
//
//                 const friendsRes = await getFriends(userId);
//                 setFriends(friendsRes.data);
//
//                 if (isOwnProfile) {
//                     const savedRes = await getSavedPosts(currentUser.id);
//                     setSavedPosts(savedRes.data);
//
//                     const sharedRes = await getSharedPosts(currentUser.id);
//                     setSharedPosts(sharedRes.data);
//                 } else {
//                     const myFriends = await getFriends(currentUser.id);
//                     setIsFriend(myFriends.data.some(f => f.id === parseInt(userId)));
//                 }
//
//             } catch (error) {
//                 console.error('Failed to load profile:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         loadProfileData();
//     }, [userId, currentUser, isOwnProfile]);
//
//     // ----- Actions -----
//     const handleSendFriendRequest = async () => {
//         try {
//             await sendFriendRequest(currentUser.id, userId);
//             setFriendRequestSent(true);
//         } catch (error) {
//             console.error('Failed to send friend request:', error);
//         }
//     };
//
//     const handleUnfriend = async () => {
//         try {
//             await unfriend(currentUser.id, userId);
//             setIsFriend(false);
//             const friendsRes = await getFriends(userId);
//             setFriends(friendsRes.data);
//         } catch (error) {
//             console.error('Failed to unfriend:', error);
//         }
//     };
//
//     const getDisplayPosts = () => {
//         if (activeTab === 'saved') return savedPosts;
//         if (activeTab === 'shared') return sharedPosts;
//         return posts;
//     };
//
//     // ----- Loading States -----
//     if (authLoading) {
//         return (
//             <>
//                 <Navbar />
//                 <div style={{ textAlign: 'center', padding: '40px' }}>
//                     Checking authentication...
//                 </div>
//             </>
//         );
//     }
//
//     if (!currentUser || loading || !profileUser) {
//         return (
//             <>
//                 <Navbar />
//                 <div style={{ textAlign: 'center', padding: '40px' }}>
//                     Loading profile...
//                 </div>
//             </>
//         );
//     }
//
//     // ----- Render -----
//     return (
//         <div className="profile-page">
//             <Navbar />
//
//             <div className="profile-container">
//                 {/* HEADER */}
//                 <div className="profile-header">
//                     <div className="profile-picture-section">
//                         <div className="profile-picture-wrapper">
//                             {profileUser.profilePicture ? (
//                                 <img
//                                     src={profileUser.profilePicture}
//                                     alt={profileUser.username}
//                                     className="profile-picture"
//                                 />
//                             ) : (
//                                 <div className="profile-picture-placeholder">
//                                     {profileUser.username?.charAt(0).toUpperCase()}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     <div className="profile-info-section">
//                         <div className="profile-top">
//                             <h1 className="profile-username">{profileUser.username}</h1>
//
//                             <div className="profile-actions">
//                                 {isOwnProfile ? (
//                                     <>
//                                         <button className="btn-edit-profile">Edit Profile</button>
//                                         <button className="btn-icon"><Settings size={20} /></button>
//                                     </>
//                                 ) : (
//                                     <>
//                                         {isFriend ? (
//                                             <button className="btn-following" onClick={handleUnfriend}>
//                                                 <UserMinus size={18} /> Unfriend
//                                             </button>
//                                         ) : friendRequestSent ? (
//                                             <button className="btn-requested" disabled>Request Sent</button>
//                                         ) : (
//                                             <button className="btn-follow" onClick={handleSendFriendRequest}>
//                                                 <UserPlus size={18} /> Add Friend
//                                             </button>
//                                         )}
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//
//                         <div className="profile-stats">
//                             <div className="stat">
//                                 <span className="stat-count">{posts.length}</span>
//                                 <span className="stat-label">posts</span>
//                             </div>
//                             <div className="stat">
//                                 <span className="stat-count">{friends.length}</span>
//                                 <span className="stat-label">friends</span>
//                             </div>
//                         </div>
//
//                         <div className="profile-bio">
//                             <p className="bio-fullname">{profileUser.fullName}</p>
//                             {profileUser.bio && <p className="bio-text">{profileUser.bio}</p>}
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* TABS */}
//                 <div className="profile-tabs">
//                     <button
//                         className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('posts')}
//                     >
//                         <Grid3x3 size={12} /> POSTS
//                     </button>
//                     {isOwnProfile && (
//                         <>
//                             <button
//                                 className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
//                                 onClick={() => setActiveTab('saved')}
//                             >
//                                 <Bookmark size={12} /> SAVED
//                             </button>
//                             <button
//                                 className={`tab ${activeTab === 'shared' ? 'active' : ''}`}
//                                 onClick={() => setActiveTab('shared')}
//                             >
//                                 <Share2 size={12} /> SHARED
//                             </button>
//                         </>
//                     )}
//                 </div>
//
//                 {/* POSTS */}
//                 <div className="profile-posts">
//                     {getDisplayPosts().length === 0 ? (
//                         <div className="no-posts">
//                             <div className="no-posts-icon">
//                                 <Image size={60} strokeWidth={1} />
//                             </div>
//                             <h3>No Posts Yet</h3>
//                             <p>
//                                 {isOwnProfile
//                                     ? 'When you share posts, they will appear here.'
//                                     : `${profileUser.username} hasn't shared any posts yet.`}
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="posts-grid">
//                             {getDisplayPosts().map(post => (
//                                 <div key={post.id} className="post-grid-item">
//                                     {post.mediaUrl ? (
//                                         <img src={post.mediaUrl} alt="Post" className="post-grid-image" />
//                                     ) : (
//                                         <div className="post-grid-content">
//                                             <p>{post.content}</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default Profile;
