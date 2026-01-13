package com.socialhub.backend.dto;

import com.socialhub.backend.module.MediaType;
import com.socialhub.backend.module.PostVisibility;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private Long id;
    private String content;
    private String mediaUrl;
    private MediaType mediaType;
    private PostVisibility visibility;
    private UserDTO user;
    private List<String> hashtags;
    private long likesCount;
    private long commentsCount;
    private long sharesCount;
    private boolean likedByCurrentUser;
    private boolean savedByCurrentUser;
    private LocalDateTime createdAt;
}
