import React, { useState } from 'react';
import { createPost } from '../services/api';
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setLoading(true);

        try {
            const response = await createPost({ content });
            onPostCreated(response.data);
            setContent('');
        } catch (err) {
            console.error('Failed to create post:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-card">
            <form onSubmit={handleSubmit}>
        <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
        />
                <button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </form>
        </div>
    );
}

export default CreatePost;
