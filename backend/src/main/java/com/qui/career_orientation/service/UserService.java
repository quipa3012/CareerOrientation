package com.qui.career_orientation.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.request.UserRequest;
import com.qui.career_orientation.entity.dto.respond.UserResponse;

public interface UserService {
    UserResponse create(UserRequest request, MultipartFile avatarFile);

    UserResponse update(Long id, UserRequest request, MultipartFile avatarFile);

    void delete(Long id);

    UserResponse getById(Long id);

    List<UserResponse> getAll();

    Optional<User> getUserByUserName(String username);

    UserResponse getByUsername(String username);

    UserResponse changePassword(String userName, String oldPasswork, String newPassword);

}
