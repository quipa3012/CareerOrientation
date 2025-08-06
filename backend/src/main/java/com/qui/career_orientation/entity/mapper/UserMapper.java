package com.qui.career_orientation.entity.mapper;

import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.respond.UserResponse;

public class UserMapper {
    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .roleName(user.getRole().getName())
                .profileImageUrl(user.getProfileImageUrl())
                .passwordChanged(user.getPasswordChanged())
                .build();
    }
}
