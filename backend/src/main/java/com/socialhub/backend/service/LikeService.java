package com.socialhub.backend.service;

import com.socialhub.backend.module.Like;
import com.socialhub.backend.module.Post;
import com.socialhub.backend.module.User;
import com.socialhub.backend.module.NotificationType;
import com.socialhub.backend.repository.LikeRepository;
import com.socialhub.backend.repository.PostRepository;
import com.socialhub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public void toggleLike(Long postId, Long userId) {
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userId);

        if (existingLike.isPresent()) {
            // Unlike
            likeRepository.delete(existingLike.get());
        } else {
            // Like
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);

            // Send Notification (only if not liking own post)
            if (!post.getUser().getId().equals(userId)) {
                notificationService.createNotification(
                        post.getUser().getId(),
                        userId,
                        NotificationType.LIKE,
                        postId,
                        user.getUsername() + " liked your post"
                );
            }
        }
    }
}