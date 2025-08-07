package com.qui.career_orientation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qui.career_orientation.entity.Clazz;

@Repository
public interface ClazzRepository extends JpaRepository<Clazz, Long> {
    boolean existsByName(String name);

    List<Clazz> findByTeacherId(Long teacherId);
}
