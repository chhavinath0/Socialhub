package com.socialhub.backend.repository;

import com.socialhub.backend.module.SharedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SharedPostRepository extends JpaRepository<SharedPost, Long> {

    // Fetch all shared posts by a user, ordered by creation date (for profile page)
    List<SharedPost> findByUserIdOrderByCreatedAtDesc(Long userId);

    // ✅ New method: find a SharedPost by the ID of the shared post itself
    Optional<SharedPost> findBySharedPostId(Long sharedPostId);

}
