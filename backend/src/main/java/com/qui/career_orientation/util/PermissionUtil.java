package com.qui.career_orientation.util;

import java.util.List;
import java.util.stream.Collectors;

import com.qui.career_orientation.entity.PermissionRole;
import com.qui.career_orientation.entity.User;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class PermissionUtil {

    public static List<String> extractPermissionNamesFromUser(User user) {
        if (user == null || user.getRole() == null || user.getRole().getPermissionRoles() == null) {
            return List.of();
        }

        return user.getRole()
                .getPermissionRoles()
                .stream()
                .map(PermissionRole::getPermission)
                .filter(permission -> permission != null && permission.getName() != null)
                .map(permission -> permission.getName())
                .collect(Collectors.toList());
    }
}