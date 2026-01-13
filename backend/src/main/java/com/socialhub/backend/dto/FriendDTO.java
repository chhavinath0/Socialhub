package com.socialhub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendDTO {
    private Long id;
    private String username;
    private String fullName;
    private String profilePicture;
    private Boolean isCloseFriend;
}