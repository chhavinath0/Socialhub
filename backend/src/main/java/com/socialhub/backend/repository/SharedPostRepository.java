package com.socialhub.backend.repository;

import com.socialhub.backend.module.SharedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedPostRepository extends JpaRepository<SharedPost, Long> {
    List<SharedPost> findByUserIdOrderByCreatedAtDesc(Long userId);
}