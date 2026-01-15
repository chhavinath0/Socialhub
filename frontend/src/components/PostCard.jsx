import React, { useState } from 'react';
import { Trash, Heart, Share } from 'lucide-react';
import { toggleLike, deletePost, sharePost } from '../services/api';
import './PostCard.css';

// ✅ HELPER: Points to the Backend Server
const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://localhost:8080${path}`;
};

function PostCard({ post, currentUserId, onDelete }) {
    const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
    const [likesCount, setLikesCount] = useState(post.likesCount);

    // ✅ FIX 1: robustly get the author ID and Name
    // The backend uses 'post.user.id', but new posts might use 'post.authorId'
    const authorId = post.user ? post.user.id : post.authorId;
    const authorName = post.user ? post.user.username : post.authorName;

    const handleLike = async () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
        try { await toggleLike(post.id, currentUserId); }
        catch (err) { setIsLiked(!newIsLiked); setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1); }
    };

    const handleShare = async () => {
        const caption = window.prompt("Add a caption:") || "";
        try {
            await sharePost(post.id, currentUserId, caption);
            alert("Shared!");
            window.location.reload();
        } catch (err) { alert("Failed to share."); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await deletePost(post.id);
            onDelete(post.id);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {/* ✅ FIX 2: Use the calculated authorName */}
                    <span className="post-author" style={{fontWeight: 'bold'}}>{authorName}</span>
                    <span style={{fontSize: '12px', color: '#718096'}}>
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* ✅ FIX 3: Check against the calculated authorId */}
                {parseInt(authorId) === parseInt(currentUserId) && (
                    <button className="icon-button" onClick={handleDelete} style={{color: '#e53e3e'}}>
                        <Trash size={16} />
                    </button>
                )}
            </div>

            <div className="post-content" style={{margin: '12px 0', whiteSpace: 'pre-wrap'}}>
                {post.content}
            </div>

            {post.mediaUrl && (
                <div style={{ marginBottom: '12px' }}>
                    <img
                        src={getImageUrl(post.mediaUrl)}
                        alt="Post"
                        onError={(e) => {console.error("Failed to load:", getImageUrl(post.mediaUrl))}}
                        style={{ width: '100%', borderRadius: '8px', maxHeight: '500px', objectFit: 'contain', backgroundColor: '#f0f2f5', border: '1px solid #ddd' }}
                    />
                </div>
            )}

            <div className="post-actions" style={{borderTop: '1px solid #edf2f7', paddingTop: '12px'}}>
                <button onClick={handleLike} className={isLiked ? 'liked' : ''} style={{color: isLiked ? '#e53e3e' : '#4a5568'}}>
                    <Heart size={16} fill={isLiked ? "#e53e3e" : "none"} /> {likesCount} Likes
                </button>
                <button onClick={handleShare}>
                    <Share size={16} /> Share
                </button>
            </div>
        </div>
    );
}

export default PostCard;