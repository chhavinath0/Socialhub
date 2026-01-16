import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Attach JWT token
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

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

// Users
export const getUserById = (id) => api.get(`/users/${id}`);
export const searchUsers = (query) =>
    api.get(`/users/search?query=${encodeURIComponent(query)}`);

export const getUserProfile = (userId, currentUserId) =>
    api.get(`/users/${userId}/profile?currentUserId=${currentUserId}`);



// Posts
export const createPost = (postData) => api.post('/posts', postData);
export const getFeed = (userId) => api.get(`/posts/feed?userId=${userId}`);
export const getUserPosts = (userId, currentUserId) =>
    api.get(`/posts/user/${userId}?currentUserId=${currentUserId}`);
export const deletePost = (postId) => api.delete(`/posts/${postId}`);
export const sharePost = (postId, userId, content) =>
    api.post('/posts/share', { postId, userId, sharedContent: content });
export const getSavedPosts = (userId) =>
    api.get(`/posts/saved?userId=${userId}`);

// Likes
export const toggleLike = (postId, userId) =>
    api.post('/likes/toggle', { postId, userId });

// Comments
export const getComments = (postId) => api.get(`/comments/post/${postId}`);
export const createComment = (commentData) => api.post('/comments', commentData);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

// Friends
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

// Notifications
export const getNotifications = (userId) =>
    api.get(`/notifications?userId=${userId}`);
export const markNotificationAsRead = (notificationId) =>
    api.put(`/notifications/${notificationId}/read`);
export const updateProfilePicture = (userId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/users/${userId}/profile-picture`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
export const toggleSavePost = (postId, userId) =>
    api.post('/posts/save/toggle', null, {
        params: { postId, userId }
    });


export default api;
