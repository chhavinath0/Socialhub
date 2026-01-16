package com.socialhub.backend.service;

import com.socialhub.backend.dto.FriendDTO;
import com.socialhub.backend.dto.FriendRequestDTO;
import com.socialhub.backend.dto.UserDTO;
import com.socialhub.backend.module.*;
import com.socialhub.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRequestRepository friendRequestRepository;
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final NotificationService notificationService;

    @Transactional
    public FriendRequestDTO sendFriendRequest(Long senderId, Long receiverId) {
        // Check if users are blocked
        if (blockedUserRepository.isBlocked(senderId, receiverId)) {
            throw new RuntimeException("Cannot send friend request to this user");
        }

        // Check if already friends
        if (friendshipRepository.existsByUserIdAndFriendId(senderId, receiverId)) {
            throw new RuntimeException("Already friends");
        }

        // Check if request already exists
        if (friendRequestRepository.findByBothUsers(senderId, receiverId).isPresent()) {
            throw new RuntimeException("Friend request already exists");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(FriendRequestStatus.PENDING);

        FriendRequest savedRequest = friendRequestRepository.save(request);

        // Create notification
        notificationService.createNotification(
                receiverId,
                senderId,
                NotificationType.FRIEND_REQUEST,
                savedRequest.getId(),
                sender.getUsername() + " sent you a friend request"
        );

        return convertToDTO(savedRequest);
    }

    @Transactional
    public void acceptFriendRequest(Long requestId, Long userId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!request.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new RuntimeException("Request already processed");
        }

        // Update request status
        request.setStatus(FriendRequestStatus.ACCEPTED);
        friendRequestRepository.save(request);

        // Create bidirectional friendship
        Friendship friendship1 = new Friendship();
        friendship1.setUser(request.getSender());
        friendship1.setFriend(request.getReceiver());
        friendship1.setIsCloseFriend(false);

        Friendship friendship2 = new Friendship();
        friendship2.setUser(request.getReceiver());
        friendship2.setFriend(request.getSender());
        friendship2.setIsCloseFriend(false);

        friendshipRepository.save(friendship1);
        friendshipRepository.save(friendship2);

        // Create notification
        notificationService.createNotification(
                request.getSender().getId(),
                userId,
                NotificationType.FRIEND_REQUEST_ACCEPTED,
                requestId,
                request.getReceiver().getUsername() + " accepted your friend request"
        );
    }

    @Transactional
    public void rejectFriendRequest(Long requestId, Long userId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!request.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        request.setStatus(FriendRequestStatus.REJECTED);
        friendRequestRepository.save(request);
    }

    public List<FriendRequestDTO> getPendingRequests(Long userId) {
        return friendRequestRepository
                .findByReceiverIdAndStatus(userId, FriendRequestStatus.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FriendDTO> getFriends(Long userId) {
        return friendshipRepository.findByUserId(userId)
                .stream()
                .map(this::convertToFriendDTO)
                .collect(Collectors.toList());
    }

    public List<FriendDTO> getCloseFriends(Long userId) {
        return friendshipRepository.findCloseFriendsByUserId(userId)
                .stream()
                .map(this::convertToFriendDTO)
                .collect(Collectors.toList());
    }
    // Check if two users are friends
    public boolean areFriends(Long userId1, Long userId2) {
        return friendshipRepository.findFriendship(userId1, userId2).isPresent();
    }

    // Get total number of friends for a user
    public int getFriendsCount(Long userId) {
        return friendshipRepository.findByUserId(userId).size();
    }

    // Get total number of close friends for a user
    public int getCloseFriendsCount(Long userId) {
        return friendshipRepository.findCloseFriendsByUserId(userId).size();
    }


    @Transactional
    public void toggleCloseFriend(Long userId, Long friendId) {
        Friendship friendship = friendshipRepository
                .findFriendship(userId, friendId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        if (friendship.getUser().getId().equals(userId)) {
            friendship.setIsCloseFriend(!friendship.getIsCloseFriend());
            friendshipRepository.save(friendship);
        }
    }

    @Transactional
    public void unfriend(Long userId, Long friendId) {
        Friendship friendship1 = friendshipRepository
                .findFriendship(userId, friendId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        // Delete both sides of friendship
        friendshipRepository.delete(friendship1);

        // Find and delete the reverse friendship
        friendshipRepository.findFriendship(friendId, userId)
                .ifPresent(friendshipRepository::delete);
    }

    // Helper methods
    private FriendRequestDTO convertToDTO(FriendRequest request) {
        FriendRequestDTO dto = new FriendRequestDTO();
        dto.setId(request.getId());
        dto.setSender(convertUserToDTO(request.getSender()));
        dto.setReceiver(convertUserToDTO(request.getReceiver()));
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());
        return dto;
    }

    private FriendDTO convertToFriendDTO(Friendship friendship) {
        User friend = friendship.getFriend();
        FriendDTO dto = new FriendDTO();
        dto.setId(friend.getId());
        dto.setUsername(friend.getUsername());
        dto.setFullName(friend.getFullName());
        dto.setProfilePicture(friend.getProfilePicture());
        dto.setIsCloseFriend(friendship.getIsCloseFriend());
        return dto;
    }

    private UserDTO convertUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setBio(user.getBio());
        dto.setProfilePicture(user.getProfilePicture());
        return dto;
    }
}