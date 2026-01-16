package com.socialhub.backend.controller;

import com.socialhub.backend.dto.ProfileDTO;
import com.socialhub.backend.dto.UserDTO;
import com.socialhub.backend.module.User;
import com.socialhub.backend.repository.UserRepository;
import com.socialhub.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    /* --------------------------------------------------
       SEARCH USERS
    -------------------------------------------------- */
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam String query,
            @RequestParam Long currentUserId
    ) {
        List<User> users = userRepository.searchUsers(query, currentUserId);

        List<UserDTO> dtos = users.stream()
                .map(u -> new UserDTO(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getFullName(),
                        u.getBio(),
                        u.getProfilePicture()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /* --------------------------------------------------
       BASIC USER FETCH (DO NOT REMOVE)
       Used for lightweight user info
    -------------------------------------------------- */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                new UserDTO(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getFullName(),
                        u.getBio(),
                        u.getProfilePicture()
                )
        );
    }

    /* --------------------------------------------------
       PROFILE ENDPOINT (THIS FIXES YOUR BLANK PAGE)
       Used ONLY by Profile.jsx
    -------------------------------------------------- */
    @GetMapping("/{userId}/profile")
    public ResponseEntity<ProfileDTO> getProfile(
            @PathVariable Long userId,
            @RequestParam Long currentUserId
    ) {
        ProfileDTO profile = userService.getProfile(userId, currentUserId);
        return ResponseEntity.ok(profile);
    }
    @PostMapping(value = "/{userId}/profile-picture", consumes = "multipart/form-data")
    public ResponseEntity<?> updateProfilePicture(
            @PathVariable Long userId,
            @RequestParam("image") MultipartFile image
    ) {
        userService.updateProfilePicture(userId, image);
        return ResponseEntity.ok(Map.of("message", "Profile picture updated"));
    }

}
