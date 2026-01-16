import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <PostProvider>
                <App />
            </PostProvider>
        </AuthProvider>
    </React.StrictMode>
);
