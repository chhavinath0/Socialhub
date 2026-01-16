// PostContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFeed } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
    const [feed, setFeed] = useState([]);
    const { user } = useAuth();

    // Load feed when user logs in
    useEffect(() => {
        const loadFeed = async () => {
            if (!user) return;
            try {
                const res = await getFeed(user.id);
                setFeed(res.data);
            } catch (err) {
                console.error('Failed to load feed', err);
            }
        };
        loadFeed();
    }, [user]);

    return (
        <PostContext.Provider value={{ feed, setFeed }}>
            {children}
        </PostContext.Provider>
    );
};
