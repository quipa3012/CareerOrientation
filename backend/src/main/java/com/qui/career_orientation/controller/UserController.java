package com.qui.career_orientation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.qui.career_orientation.entity.dto.request.UserRequest;
import com.qui.career_orientation.entity.dto.respond.ApiRespond;
import com.qui.career_orientation.entity.dto.respond.UserResponse;
import com.qui.career_orientation.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiRespond<UserResponse>> create(@RequestBody UserRequest request) {
        UserResponse user = userService.create(request);
        return ResponseEntity.ok(ApiRespond.success("Tạo người dùng thành công", user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiRespond<UserResponse>> update(@PathVariable Long id, @RequestBody UserRequest request) {
        UserResponse updatedUser = userService.update(id, request);
        return ResponseEntity.ok(ApiRespond.success("Cập nhật người dùng thành công", updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiRespond<?>> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiRespond.success("Xoá người dùng thành công", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiRespond<UserResponse>> getById(@PathVariable Long id) {
        UserResponse user = userService.getById(id);
        return ResponseEntity.ok(ApiRespond.success("Lấy thông tin người dùng thành công", user));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('UPDATE_DATA')")
    public ResponseEntity<ApiRespond<List<UserResponse>>> getAll() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("🧑 Username: {}", authentication.getName());

        var authorities = authentication.getAuthorities()
                .stream()
                .map(auth -> auth.getAuthority())
                .toList();

        log.info("🔐 Authorities: {}", authorities);

        List<UserResponse> users = userService.getAll();
        return ResponseEntity.ok(ApiRespond.success("Lấy danh sách người dùng thành công", users));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiRespond<UserResponse>> getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponse user = userService.getByUsername(username);
        return ResponseEntity.ok(ApiRespond.success("Lấy thông tin người dùng hiện tại thành công", user));
    }
}
