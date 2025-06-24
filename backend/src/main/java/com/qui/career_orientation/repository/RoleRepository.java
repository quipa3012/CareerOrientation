package com.qui.career_orientation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qui.career_orientation.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

}
