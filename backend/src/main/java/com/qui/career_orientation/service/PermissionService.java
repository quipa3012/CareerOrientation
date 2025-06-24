package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.Permission;

public interface PermissionService {
    Permission create(Permission permission);

    List<Permission> getAll();

    Permission getByName(String name);

    Permission update(String name, Permission permission);

    void deleteByName(String name);
}
