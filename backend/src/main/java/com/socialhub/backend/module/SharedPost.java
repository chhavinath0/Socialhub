package com.socialhub.backend.module;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "shared_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SharedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_post_id", nullable = false)
    private Post originalPost;

    @Column(name = "shared_content", columnDefinition = "TEXT")
    private String sharedContent;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}