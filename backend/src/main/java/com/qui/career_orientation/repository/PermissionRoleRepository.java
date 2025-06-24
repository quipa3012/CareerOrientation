package com.qui.career_orientation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qui.career_orientation.entity.PermissionRole;

@Repository
public interface PermissionRoleRepository extends JpaRepository<PermissionRole, Long> {
    List<PermissionRole> findByRole_Name(String roleName);

    boolean existsByRole_NameAndPermission_Name(String roleName, String permissionName);

    void deleteByRole_NameAndPermission_Name(String roleName, String permissionName);
}