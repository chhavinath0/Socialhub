import React, { useState } from 'react';
import { acceptFriendRequest, rejectFriendRequest } from '../services/api';
import './FriendRequest.css';

function FriendRequest({ request, onUpdate }) {
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        setLoading(true);
        try {
            await acceptFriendRequest(request.id, request.receiverId);
            onUpdate();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await rejectFriendRequest(request.id, request.receiverId);
            onUpdate();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="friend-request-card">
            <span>{request.senderName}</span>
            <div className="friend-request-actions">
                <button onClick={handleAccept} disabled={loading}>Accept</button>
                <button onClick={handleReject} disabled={loading}>Reject</button>
            </div>
        </div>
    );
}

export default FriendRequest;
