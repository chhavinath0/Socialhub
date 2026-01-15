package com.socialhub.backend.service;

import com.socialhub.backend.module.Comment;
import com.socialhub.backend.module.Post;
import com.socialhub.backend.module.User;
import com.socialhub.backend.repository.CommentRepository; // You need to create this Repo interface!
import com.socialhub.backend.repository.PostRepository;
import com.socialhub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    // NOTE: Make sure you created CommentRepository interface in your repository package
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addComment(Long postId, Long userId, String content) {
        Post post = postRepository.findById(postId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);

        commentRepository.save(comment);
    }
}