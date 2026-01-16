package com.socialhub.backend.service;

import com.socialhub.backend.dto.ProfileDTO;
import com.socialhub.backend.module.User;
import com.socialhub.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.socialhub.backend.service.FriendService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FriendService friendService;
    //private final BlockService blockService;
    @Transactional
    public void updateProfilePicture(Long userId, MultipartFile image) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            String uploadDir = "uploads";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String original = image.getOriginalFilename();
            String cleanName = original.replaceAll("[^a-zA-Z0-9._-]", "_");
            String filename = UUID.randomUUID() + "_" + cleanName;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(image.getInputStream(), filePath);

            user.setProfilePicture("/uploads/" + filename);
            userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile picture", e);
        }
    }


    public ProfileDTO getProfile(Long userId, Long currentUserId) {

        User profileUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isFriend = friendService.areFriends(currentUserId, userId);


        int friendsCount = friendService.getFriendsCount(userId);
        int closeFriendsCount = friendService.getCloseFriendsCount(userId);

        return new ProfileDTO(
                profileUser,
                isFriend,

                friendsCount,
                closeFriendsCount
        );
    }
}
