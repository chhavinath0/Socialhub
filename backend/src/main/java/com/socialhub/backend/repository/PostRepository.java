package com.socialhub.backend.repository;

import com.socialhub.backend.module.Post;
import com.socialhub.backend.module.PostVisibility;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT p FROM Post p WHERE p.user.id IN ?1 " +
            "AND p.visibility = ?2 ORDER BY p.createdAt DESC")
    List<Post> findByUserIdsAndVisibility(List<Long> userIds, PostVisibility visibility);

    @Query("SELECT p FROM Post p WHERE p.user.id = ?1 ORDER BY p.createdAt DESC")
    List<Post> findByUserIdWithAllVisibility(Long userId);

    // ✅ ADDED THIS: Fetches all posts for a list of users (friends + self)
    @Query("SELECT p FROM Post p WHERE p.user.id IN ?1 ORDER BY p.createdAt DESC")
    List<Post> findAllByUserIds(List<Long> userIds);

}
