package com.socialhub.backend.dto;

import com.socialhub.backend.module.MediaType;
import com.socialhub.backend.module.PostVisibility;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePostRequest {

    @NotBlank(message = "Content is required")
    private String content;

    private String mediaUrl;
    private MediaType mediaType;
    private PostVisibility visibility;
    private Long userId;
}