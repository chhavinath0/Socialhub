package com.socialhub.backend.dto;

import com.socialhub.backend.module.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDTO {

    private User user;

    private boolean isFriend;


    private int friendsCount;
    private int closeFriendsCount;
}
