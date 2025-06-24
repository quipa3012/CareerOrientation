package com.qui.career_orientation.service;

import java.util.List;
import java.util.Optional;

import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.request.UserRequest;
import com.qui.career_orientation.entity.dto.respond.UserResponse;

public interface UserService {
    UserResponse create(UserRequest request);

    UserResponse update(Long id, UserRequest request);

    void delete(Long id);

    UserResponse getById(Long id);

    List<UserResponse> getAll();

    Optional<User> getUserByUserName(String username);

    void createAdminAccountIfNotExists();

    void createTestUserAccountIfNotExists();

    UserResponse getByUsername(String username);
}
