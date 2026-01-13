package com.socialhub.backend.repository;

import com.socialhub.backend.module.SavedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {

    List<SavedPost> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<SavedPost> findByUserIdAndPostId(Long userId, Long postId);

    boolean existsByUserIdAndPostId(Long userId, Long postId);
}
