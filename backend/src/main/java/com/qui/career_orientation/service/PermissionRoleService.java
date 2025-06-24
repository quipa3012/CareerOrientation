package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.PermissionRole;

public interface PermissionRoleService {
    List<PermissionRole> getByRoleName(String roleName);

    PermissionRole addPermissionToRole(String roleName, String permissionName);

    void removePermissionFromRole(String roleName, String permissionName);
}