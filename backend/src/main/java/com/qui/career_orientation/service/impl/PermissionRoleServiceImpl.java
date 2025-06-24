package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.Permission;
import com.qui.career_orientation.entity.PermissionRole;
import com.qui.career_orientation.entity.Role;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.PermissionRepository;
import com.qui.career_orientation.repository.PermissionRoleRepository;
import com.qui.career_orientation.repository.RoleRepository;
import com.qui.career_orientation.service.PermissionRoleService;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermissionRoleServiceImpl implements PermissionRoleService {

    private final PermissionRoleRepository permissionRoleRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public List<PermissionRole> getByRoleName(String roleName) {
        return permissionRoleRepository.findByRole_Name(roleName);
    }

    @Override
    public PermissionRole addPermissionToRole(String roleName, String permissionName) {
        if (permissionRoleRepository.existsByRole_NameAndPermission_Name(roleName, permissionName)) {
            throw new AppException(ErrorCode.PERMISSION_ALREADY_EXIST);
        }

        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        Permission permission = permissionRepository.findById(permissionName)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));

        PermissionRole permissionRole = PermissionRole.builder()
                .role(role)
                .permission(permission)
                .build();

        return permissionRoleRepository.save(permissionRole);
    }

    @Override
    public void removePermissionFromRole(String roleName, String permissionName) {
        if (!permissionRoleRepository.existsByRole_NameAndPermission_Name(roleName, permissionName)) {
            throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        }

        permissionRoleRepository.deleteByRole_NameAndPermission_Name(roleName, permissionName);
    }
}
