import React, { useState } from 'react';
import { createPost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Image as ImageIcon, X } from 'lucide-react'; // Import icons
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null); // State for the file
    const [preview, setPreview] = useState(null); // State for the preview URL
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Create a fake URL for preview
        }
    };

    const clearImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return; // Allow post if it has image OR text

        if (!user || !user.id) {
            alert("You must be logged in to post!");
            return;
        }

        setLoading(true);

        try {
            // 1. Create FormData object (Required for file uploads)
            const formData = new FormData();
            formData.append('userId', user.id);
            formData.append('content', content);
            if (image) {
                formData.append('image', image); // Must match backend @RequestParam name
            }

            const response = await createPost(formData);
            onPostCreated(response.data);

            // Reset form
            setContent('');
            clearImage();
        } catch (err) {
            console.error('Failed to create post:', err);
            alert('Failed to post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-card">
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder={`What's on your mind, ${user?.username || 'user'}?`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                />

                {/* Image Preview Area */}
                {preview && (
                    <div style={{ position: 'relative', marginTop: '10px', marginBottom: '10px' }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <button
                            type="button"
                            onClick={clearImage}
                            style={{
                                position: 'absolute', top: '5px', right: '5px',
                                background: 'rgba(0,0,0,0.6)', color: 'white',
                                borderRadius: '50%', padding: '4px', cursor: 'pointer', border: 'none'
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    {/* Hidden File Input + Custom Button */}
                    <div>
                        <input
                            type="file"
                            id="post-image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor="post-image"
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#667eea', fontWeight: '500' }}
                        >
                            <ImageIcon size={20} />
                            <span>Photo</span>
                        </label>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePost;