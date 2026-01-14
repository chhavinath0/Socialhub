import React from 'react';
import { Trash, Heart, Share } from 'lucide-react';
import { toggleLike, deletePost } from '../services/api';
import './PostCard.css';

function PostCard({ post, currentUserId, onDelete }) {
    const handleLike = async () => {
        try {
            await toggleLike(post.id, currentUserId);
            post.likedByCurrentUser = !post.likedByCurrentUser;
        } catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost(post.id);
            onDelete(post.id);
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-author">{post.authorName}</div>
                {post.authorId === currentUserId && (
                    <button className="icon-button" onClick={handleDelete}>
                        <Trash size={16} />
                    </button>
                )}
            </div>
            <div className="post-content">{post.content}</div>
            <div className="post-actions">
                <button onClick={handleLike} className={post.likedByCurrentUser ? 'liked' : ''}>
                    <Heart size={16} />
                    {post.likesCount}
                </button>
                <button>
                    <Share size={16} />
                    Share
                </button>
            </div>
        </div>
    );
}

export default PostCard;
