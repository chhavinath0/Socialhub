package com.socialhub.backend.controller;

import com.socialhub.backend.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(@RequestBody Map<String, Long> request) {
        Long postId = request.get("postId");
        Long userId = request.get("userId");

        likeService.toggleLike(postId, userId);
        return ResponseEntity.ok(Map.of("message", "Success"));
    }
}