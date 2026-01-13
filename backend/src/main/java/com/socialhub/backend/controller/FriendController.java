package com.socialhub.backend.controller;

import com.socialhub.backend.dto.FriendDTO;
import com.socialhub.backend.dto.FriendRequestDTO;
import com.socialhub.backend.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/request")
    public ResponseEntity<FriendRequestDTO> sendFriendRequest(@RequestBody Map<String, Long> request) {
        Long senderId = request.get("senderId");
        Long receiverId = request.get("receiverId");
        return ResponseEntity.ok(friendService.sendFriendRequest(senderId, receiverId));
    }

    @PutMapping("/request/{requestId}/accept")
    public ResponseEntity<Map<String, String>> acceptFriendRequest(
            @PathVariable Long requestId,
            @RequestParam Long userId) {
        friendService.acceptFriendRequest(requestId, userId);
        return ResponseEntity.ok(Map.of("message", "Friend request accepted"));
    }

    @PutMapping("/request/{requestId}/reject")
    public ResponseEntity<Map<String, String>> rejectFriendRequest(
            @PathVariable Long requestId,
            @RequestParam Long userId) {
        friendService.rejectFriendRequest(requestId, userId);
        return ResponseEntity.ok(Map.of("message", "Friend request rejected"));
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<FriendRequestDTO>> getPendingRequests(@RequestParam Long userId) {
        return ResponseEntity.ok(friendService.getPendingRequests(userId));
    }

    @GetMapping
    public ResponseEntity<List<FriendDTO>> getFriends(@RequestParam Long userId) {
        return ResponseEntity.ok(friendService.getFriends(userId));
    }

    @GetMapping("/close-friends")
    public ResponseEntity<List<FriendDTO>> getCloseFriends(@RequestParam Long userId) {
        return ResponseEntity.ok(friendService.getCloseFriends(userId));
    }

    @PutMapping("/close-friend/toggle")
    public ResponseEntity<Map<String, String>> toggleCloseFriend(@RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        Long friendId = request.get("friendId");
        friendService.toggleCloseFriend(userId, friendId);
        return ResponseEntity.ok(Map.of("message", "Close friend status updated"));
    }

    @DeleteMapping("/{friendId}")
    public ResponseEntity<Map<String, String>> unfriend(
            @PathVariable Long friendId,
            @RequestParam Long userId) {
        friendService.unfriend(userId, friendId);
        return ResponseEntity.ok(Map.of("message", "Friend removed"));
    }
}
