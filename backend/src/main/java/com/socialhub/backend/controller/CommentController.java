package com.socialhub.backend.controller;

import com.socialhub.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Map<String, Object> request) {
        Long postId = Long.valueOf(request.get("postId").toString());
        Long userId = Long.valueOf(request.get("userId").toString());
        String content = (String) request.get("content");

        commentService.addComment(postId, userId, content);
        return ResponseEntity.ok(Map.of("message", "Comment added"));
    }
}