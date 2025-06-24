package com.qui.career_orientation.service;

import com.qui.career_orientation.entity.Role;

public interface RoleService {
    Role create(Role role);

    Role getByName(String name);

    void deleteByName(String name);

    void createDefaultRoles();
}
