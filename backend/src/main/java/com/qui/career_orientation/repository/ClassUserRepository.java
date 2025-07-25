package com.qui.career_orientation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qui.career_orientation.entity.ClassUser;

public interface ClassUserRepository extends JpaRepository<ClassUser, Long> {

    boolean existsByClazz_IdAndUser_Id(Long clazzId, Long userId);

    Optional<ClassUser> findByClazz_IdAndUser_Id(Long clazzId, Long userId);

    List<ClassUser> findByClazz_Id(Long clazzId);
}