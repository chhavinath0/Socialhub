package com.socialhub.backend.repository;

import com.socialhub.backend.module.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    List<Friendship> findByUserId(Long userId);

    @Query("SELECT f FROM Friendship f WHERE f.user.id = ?1 AND f.isCloseFriend = true")
    List<Friendship> findCloseFriendsByUserId(Long userId);

    @Query("SELECT f FROM Friendship f WHERE " +
            "(f.user.id = ?1 AND f.friend.id = ?2) OR " +
            "(f.user.id = ?2 AND f.friend.id = ?1)")
    Optional<Friendship> findFriendship(Long userId1, Long userId2);

    boolean existsByUserIdAndFriendId(Long userId, Long friendId);
}