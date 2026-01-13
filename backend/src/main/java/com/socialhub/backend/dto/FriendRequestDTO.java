package com.socialhub.backend.dto;

import com.socialhub.backend.module.FriendRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestDTO {
    private Long id;
    private UserDTO sender;
    private UserDTO receiver;
    private FriendRequestStatus status;
    private LocalDateTime createdAt;
}
