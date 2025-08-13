package com.qui.career_orientation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.qui.career_orientation.entity.ClassUser;

public interface ClassUserRepository extends JpaRepository<ClassUser, Long> {

    boolean existsByClazz_IdAndUser_Id(Long clazzId, Long userId);

    Optional<ClassUser> findByClazz_IdAndUser_Id(Long clazzId, Long userId);

    List<ClassUser> findByClazz_Id(Long clazzId);

    List<ClassUser> findByUser_Id(Long userId);

    @Query("""
                SELECT cu.user.id
                FROM ClassUser cu
                WHERE cu.clazz.id = :clazzId
                  AND cu.isTeacher = false
            """)
    List<Long> findStudentIdsByClazzId(Long clazzId);

}