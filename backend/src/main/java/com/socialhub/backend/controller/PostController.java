package com.socialhub.backend.controller;

import com.socialhub.backend.dto.PostDTO;
import com.socialhub.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    private final PostService postService;

    // ✅ FIX: Use the string "multipart/form-data" directly.
    // This solves all import conflicts.
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PostDTO> createPost(
            @RequestParam("userId") Long userId,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        return ResponseEntity.ok(postService.createPost(userId, content, image));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostDTO>> getFeed(@RequestParam Long userId) {
        return ResponseEntity.ok(postService.getFeed(userId));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok().build();
    }

    // ... keep your sharePost method here if you added it earlier ...
    @PostMapping("/share")
    public ResponseEntity<?> sharePost(@RequestBody java.util.Map<String, Object> request) {
        Long postId = Long.valueOf(request.get("postId").toString());
        Long userId = Long.valueOf(request.get("userId").toString());
        String content = (String) request.get("sharedContent");

        postService.sharePost(postId, userId, content);
        return ResponseEntity.ok(java.util.Map.of("message", "Post shared successfully"));
    }
}