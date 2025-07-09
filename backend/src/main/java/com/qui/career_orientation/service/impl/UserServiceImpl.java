package com.qui.career_orientation.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.qui.career_orientation.entity.*;
import com.qui.career_orientation.entity.dto.request.UserRequest;
import com.qui.career_orientation.entity.dto.respond.UserResponse;
import com.qui.career_orientation.entity.mapper.UserMapper;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.RoleRepository;
import com.qui.career_orientation.repository.UserRepository;
import com.qui.career_orientation.service.StorageService;
import com.qui.career_orientation.service.UserService;
import com.qui.career_orientation.util.constant.ErrorCode;
import com.qui.career_orientation.util.constant.RoleConstant;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;

    @Override
    public UserResponse create(UserRequest request, MultipartFile avatarFile) {
        checkDuplicateUsernameAndEmail(request.getUsername(), request.getEmail());

        Role role = getRoleOrThrow(RoleConstant.USER.name());

        String profileImageUrl = null;
        if (avatarFile != null && !avatarFile.isEmpty()) {
            profileImageUrl = storageService.storeAvatarFile(request.getUsername(), avatarFile);
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .role(role)
                .profileImageUrl(profileImageUrl)
                .passwordChanged(true)
                .build();

        userRepository.save(user);
        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse update(Long id, UserRequest request, MultipartFile avatarFile) {
        User user = getUserByIdOrThrow(id);

        if (!user.getUsername().equals(request.getUsername())) {
            checkDuplicateUsername(request.getUsername());
        }
        if (!user.getEmail().equals(request.getEmail())) {
            checkDuplicateEmail(request.getEmail());
        }

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPasswordChanged(true);
        }

        // Xử lý avatar mới nếu có upload
        if (avatarFile != null && !avatarFile.isEmpty()) {
            // Xoá avatar cũ nếu có
            if (user.getProfileImageUrl() != null) {
                storageService.deleteAvatarFile(user.getProfileImageUrl());
            }
            String profileImageUrl = storageService.storeAvatarFile(user.getUsername(), avatarFile);
            user.setProfileImageUrl(profileImageUrl);
        }

        userRepository.save(user);
        return UserMapper.toResponse(user);
    }

    @Override
    public void delete(Long id) {
        User user = getUserByIdOrThrow(id);

        // Xoá avatar file nếu có
        if (user.getProfileImageUrl() != null) {
            storageService.deleteAvatarFile(user.getProfileImageUrl());
        }

        userRepository.delete(user);
    }

    @Override
    public UserResponse getById(Long id) {
        return UserMapper.toResponse(getUserByIdOrThrow(id));
    }

    @Override
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(UserMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<User> getUserByUserName(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public void createAdminAccountIfNotExists() {
        createDefaultAccountIfNotExists(
                "admin",
                "Administrator",
                "admin@gmail.com",
                "admin",
                RoleConstant.ADMIN.name(),
                "Admin account created with username 'admin' and password 'admin'. Please change it immediately after login.");
    }

    @Override
    public void createTestUserAccountIfNotExists() {
        createDefaultAccountIfNotExists(
                "user",
                "Test User",
                "test@gmail.com",
                "user",
                RoleConstant.USER.name(),
                "Test User account created with username 'user' and password 'user'. Please change it immediately after login.");
    }

    @Override
    public UserResponse getByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(UserMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    /** ----------- Private helper methods ----------- **/

    private void checkDuplicateUsernameAndEmail(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
    }

    private void checkDuplicateUsername(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
    }

    private void checkDuplicateEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
    }

    private Role getRoleOrThrow(String roleName) {
        return roleRepository.findById(roleName)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
    }

    private User getUserByIdOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private void createDefaultAccountIfNotExists(String username, String fullName, String email, String rawPassword,
            String roleName, String logMessage) {
        if (!userRepository.existsByUsername(username)) {
            Role role = getRoleOrThrow(roleName);

            User user = User.builder()
                    .username(username)
                    .fullName(fullName)
                    .password(passwordEncoder.encode(rawPassword))
                    .email(email)
                    .role(role)
                    .passwordChanged(true)
                    .build();

            userRepository.save(user);
            log.warn(logMessage);
        }
    }
}
