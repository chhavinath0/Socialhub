package com.socialhub.backend.controller;

import com.socialhub.backend.dto.UserDTO;
import com.socialhub.backend.module.User;
import com.socialhub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String query, @RequestParam Long currentUserId) {
        List<User> users = userRepository.searchUsers(query, currentUserId);

        List<UserDTO> dtos = users.stream()
                .map(u -> new UserDTO(u.getId(), u.getUsername(), u.getEmail(), u.getFullName(), u.getBio(), u.getProfilePicture()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        User u = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserDTO(u.getId(), u.getUsername(), u.getEmail(), u.getFullName(), u.getBio(), u.getProfilePicture()));
    }
}