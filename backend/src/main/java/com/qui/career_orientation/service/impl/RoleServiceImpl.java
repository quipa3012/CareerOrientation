package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.Role;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.RoleRepository;
import com.qui.career_orientation.service.RoleService;
import com.qui.career_orientation.util.constant.ErrorCode;
import com.qui.career_orientation.util.constant.RoleConstant;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public Role create(Role role) {
        if (roleRepository.existsById(role.getName())) {
            throw new AppException(ErrorCode.ROLE_ALREADY_EXIST);
        }
        return roleRepository.save(role);
    }

    @Override
    public Role getByName(String name) {
        return roleRepository.findById(name)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
    }

    @Override
    public void deleteByName(String name) {
        roleRepository.deleteById(name);
    }

    private void createRoleIfNotExists(String roleName) {
        if (!roleRepository.existsById(roleName)) {
            Role role = Role.builder()
                    .name(roleName)
                    .permissionRoles(List.of())
                    .build();
            roleRepository.save(role);
        }
    }

    @Override
    public void createDefaultRoles() {
        createRoleIfNotExists(RoleConstant.ADMIN.name());
        createRoleIfNotExists(RoleConstant.USER.name());
    }

}
