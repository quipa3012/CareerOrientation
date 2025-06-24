package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.Permission;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.PermissionRepository;
import com.qui.career_orientation.service.PermissionService;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public Permission create(Permission permission) {
        if (permissionRepository.existsById(permission.getName())) {
            throw new AppException(ErrorCode.PERMISSION_ALREADY_EXIST);
        }

        Permission saved = Permission.builder()
                .name(permission.getName())
                .description(permission.getDescription())
                .build();

        return permissionRepository.save(saved);
    }

    @Override
    public List<Permission> getAll() {
        return permissionRepository.findAll();
    }

    @Override
    public Permission getByName(String name) {
        return permissionRepository.findById(name)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
    }

    @Override
    public Permission update(String name, Permission updatedPermission) {
        Permission existing = permissionRepository.findById(name)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));

        Permission toUpdate = Permission.builder()
                .name(existing.getName())
                .description(updatedPermission.getDescription())
                .build();

        return permissionRepository.save(toUpdate);
    }

    @Override
    public void deleteByName(String name) {
        if (!permissionRepository.existsById(name)) {
            throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        }

        permissionRepository.deleteById(name);
    }
}
