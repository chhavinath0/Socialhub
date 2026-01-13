package com.socialhub.backend.repository;

import com.socialhub.backend.module.BlockedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {

    Optional<BlockedUser> findByBlockerIdAndBlockedId(Long blockerId, Long blockedId);

    List<BlockedUser> findByBlockerId(Long blockerId);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
            "FROM BlockedUser b WHERE " +
            "(b.blocker.id = ?1 AND b.blocked.id = ?2) OR " +
            "(b.blocker.id = ?2 AND b.blocked.id = ?1)")
    boolean isBlocked(Long userId1, Long userId2);
}