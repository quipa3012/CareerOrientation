package com.qui.career_orientation.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.*;
import com.qui.career_orientation.entity.dto.request.UserRequest;
import com.qui.career_orientation.entity.dto.respond.UserResponse;
import com.qui.career_orientation.entity.mapper.UserMapper;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.RoleRepository;
import com.qui.career_orientation.repository.UserRepository;
import com.qui.career_orientation.service.RoleService;
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
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final RoleRepository roleRepository;

    @Override
    public UserResponse create(UserRequest request) {
        Role role = roleService.getByName(RoleConstant.USER.name());
        if (role == null) {
            throw new AppException(ErrorCode.ROLE_USER_DOES_NOT_EXIST);
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .role(role)
                .build();

        userRepository.save(user);
        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse update(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);
        return UserMapper.toResponse(user);
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserResponse getById(Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
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
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findById(RoleConstant.ADMIN.name())
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));

            User admin = User.builder()
                    .username("admin")
                    .fullName("Administrator")
                    .password(passwordEncoder.encode("admin"))
                    .email("admin@gmail.com")
                    .role(adminRole)
                    .build();

            userRepository.save(admin);
            log.warn(
                    "Admin account created with username 'admin' and password 'admin'. Please change it immediately after login.");
        }
    }

    @Override
    public void createTestUserAccountIfNotExists() {
        if (!userRepository.existsByUsername("user")) {
            Role userRole = roleRepository.findById(RoleConstant.USER
                    .name())
                    .orElseThrow(() -> new RuntimeException("USER role not found"));

            User admin = User.builder()
                    .username("user")
                    .fullName("Test User")
                    .password(passwordEncoder.encode("user"))
                    .email("test@gmail.com")
                    .role(userRole)
                    .build();

            userRepository.save(admin);
            log.warn(
                    "Test User account created with username 'user' and password 'user'. Please change it immediately after login.");
        }
    }

    @Override
    public UserResponse getByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(UserMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

}
