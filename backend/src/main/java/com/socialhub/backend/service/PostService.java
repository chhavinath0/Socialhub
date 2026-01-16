package com.socialhub.backend.service;

import com.socialhub.backend.dto.PostDTO;
import com.socialhub.backend.dto.UserDTO;
import com.socialhub.backend.module.*;
import com.socialhub.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final SharedPostRepository sharedPostRepository;
    private final SavedPostRepository savedPostRepository;


    // ✅ FIX: This was missing! We must inject this repository.
    private final FriendshipRepository friendshipRepository;

    @Transactional
    public PostDTO createPost(Long userId, String content, MultipartFile image) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setContent(content);
        post.setVisibility(PostVisibility.PUBLIC);
        post.setCreatedAt(LocalDateTime.now());

        // Handle Image Upload
        if (image != null && !image.isEmpty()) {
            try {
                // 1. Create uploads directory if it doesn't exist
                String uploadDir = "uploads"; // Matches application.properties
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // 2. Generate unique filename
                //String filename = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                String original = image.getOriginalFilename();
                String cleanName = original.replaceAll("[^a-zA-Z0-9._-]", "_");
                String filename = UUID.randomUUID() + "_" + cleanName;

                Path filePath = uploadPath.resolve(filename);

                // 3. Save file
                Files.copy(image.getInputStream(), filePath);

                // 4. Set URL (We will serve this via a static resource handler)
                post.setMediaUrl("/uploads/" + filename);
                post.setMediaType(MediaType.IMAGE); // Set your Enum type

            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        } else {
            post.setMediaType(MediaType.TEXT);
        }

        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost, userId);
    }
    @Transactional(readOnly = true)
    public List<PostDTO> getSavedPosts(Long userId) {

        return savedPostRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(saved -> convertToDTO(saved.getPost(), userId))
                .collect(Collectors.toList());
    }


    @Transactional
    public void toggleSavePost(Long postId, Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 🚫 RULE: User cannot save own post
        if (post.getUser().getId().equals(userId)) {
            throw new RuntimeException("You cannot save your own post");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        savedPostRepository.findByUserIdAndPostId(userId, postId)
                .ifPresentOrElse(
                        savedPostRepository::delete,
                        () -> {
                            SavedPost saved = new SavedPost();
                            saved.setUser(user);
                            saved.setPost(post);
                            savedPostRepository.save(saved);
                        }
                );
    }


    public List<PostDTO> getFeed(Long currentUserId) {
        // 1. Get list of all friends
        // Now this works because friendshipRepository is an instance variable
        List<Friendship> friendships = friendshipRepository.findByUserId(currentUserId);

        // 2. Extract Friend IDs
        List<Long> userIds = friendships.stream()
                .map(f -> f.getFriend().getId())
                .collect(Collectors.toList());

        // 3. Add my own ID (so I can see my own posts)
        userIds.add(currentUserId);

        // 4. Fetch posts for these users
        List<Post> posts = postRepository.findAllByUserIds(userIds);

        // 5. Convert to DTOs
        return posts.stream()
                .map(post -> convertToDTO(post, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    private PostDTO convertToDTO(Post post, Long currentUserId) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());

        User u = post.getUser();
        dto.setUser(new UserDTO(u.getId(), u.getUsername(), u.getEmail(), u.getFullName(), u.getBio(), u.getProfilePicture()));

        dto.setLikesCount(post.getLikes().size());
        dto.setCommentsCount(post.getComments().size());

        boolean isLiked = post.getLikes().stream()
                .anyMatch(like -> like.getUser().getId().equals(currentUserId));
        dto.setLikedByCurrentUser(isLiked);
        boolean isSaved = savedPostRepository.existsByUserIdAndPostId(
                currentUserId, post.getId()
        );

        dto.setSavedByCurrentUser(isSaved);

        return dto;
    }
    @Transactional
    public void sharePost(Long postId, Long userId, String content) {
        Post originalPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Create a record in SharedPost table
        SharedPost sharedPost = new SharedPost();
        sharedPost.setOriginalPost(originalPost);
        sharedPost.setUser(user);
        sharedPost.setSharedContent(content);
        sharedPostRepository.save(sharedPost);

        // 2. ALSO create a new Post so it appears in feeds as a "Shared" post
        Post newPost = new Post();
        newPost.setUser(user);
        newPost.setContent((content != null ? content : "") + "\n\n[Shared Post]: " + originalPost.getContent());
        newPost.setVisibility(PostVisibility.PUBLIC);
        newPost.setCreatedAt(LocalDateTime.now());
        postRepository.save(newPost);
    }
    @Transactional(readOnly = true)
    public List<PostDTO> getUserPosts(Long profileUserId, Long currentUserId) {

        User profileUser = userRepository.findById(profileUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If viewing own profile → return all posts
        List<Post> posts;
        if (profileUserId.equals(currentUserId)) {
            posts = postRepository.findByUserIdWithAllVisibility(profileUserId);
        } else {
            // Viewing another user's profile → only show PUBLIC posts
            posts = postRepository.findByUserIdsAndVisibility(
                    List.of(profileUserId), PostVisibility.PUBLIC
            );
        }

        // Convert to DTO
        return posts.stream()
                .map(post -> convertToDTO(post, currentUserId))
                .collect(Collectors.toList());
    }

}
