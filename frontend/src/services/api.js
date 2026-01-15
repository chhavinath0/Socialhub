import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

// User APIs
export const getUserById = (id) => api.get(`/users/${id}`);
export const searchUsers = (query) => api.get(`/users/search?query=${query}`);

// Post APIs
//export const createPost = (postData) => api.post('/posts', postData);
export const createPost = (postData)=> api.post('/posts',postData, {
    headers:{
        'Content-Type':null
    }
});
export const getFeed = (userId) => api.get(`/posts/feed?userId=${userId}`);
export const getUserPosts = (userId, currentUserId) =>
    api.get(`/posts/user/${userId}?currentUserId=${currentUserId}`);
export const deletePost = (postId) => api.delete(`/posts/${postId}`);
export const toggleSavePost = (postId, userId) =>
    api.post('/posts/save/toggle', { postId, userId });
export const getSavedPosts = (userId) => api.get(`/posts/saved?userId=${userId}`);
export const sharePost = (postId, userId, content) =>
    api.post('/posts/share', { postId, userId, sharedContent: content });

// Like APIs
export const toggleLike = (postId, userId) =>
    api.post('/likes/toggle', { postId, userId });

// Comment APIs
export const getComments = (postId) => api.get(`/comments/post/${postId}`);
export const createComment = (commentData) => api.post('/comments', commentData);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

// Friend APIs
export const sendFriendRequest = (senderId, receiverId) =>
    api.post('/friends/request', { senderId, receiverId });
export const acceptFriendRequest = (requestId, userId) =>
    api.put(`/friends/request/${requestId}/accept?userId=${userId}`);
export const rejectFriendRequest = (requestId, userId) =>
    api.put(`/friends/request/${requestId}/reject?userId=${userId}`);
export const getPendingRequests = (userId) =>
    api.get(`/friends/requests/pending?userId=${userId}`);
export const getFriends = (userId) => api.get(`/friends?userId=${userId}`);
export const getCloseFriends = (userId) =>
    api.get(`/friends/close-friends?userId=${userId}`);
export const toggleCloseFriend = (userId, friendId) =>
    api.put('/friends/close-friend/toggle', { userId, friendId });
export const unfriend = (userId, friendId) =>
    api.delete(`/friends/${friendId}?userId=${userId}`);

// Notification APIs
export const getNotifications = (userId) =>
    api.get(`/notifications?userId=${userId}`);
export const markNotificationAsRead = (notificationId) =>
    api.put(`/notifications/${notificationId}/read`);

export default api;