package com.socialhub.backend.repository;

import com.socialhub.backend.module.FriendRequest;
import com.socialhub.backend.module.FriendRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    List<FriendRequest> findByReceiverIdAndStatus(Long receiverId, FriendRequestStatus status);

    List<FriendRequest> findBySenderIdAndStatus(Long senderId, FriendRequestStatus status);

    Optional<FriendRequest> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

    @Query("SELECT fr FROM FriendRequest fr WHERE " +
            "(fr.sender.id = ?1 AND fr.receiver.id = ?2) OR " +
            "(fr.sender.id = ?2 AND fr.receiver.id = ?1)")
    Optional<FriendRequest> findByBothUsers(Long userId1, Long userId2);
}