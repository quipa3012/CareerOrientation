package com.qui.career_orientation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qui.career_orientation.entity.Block;
import com.qui.career_orientation.entity.Major;

public interface MajorRepository extends JpaRepository<Major, Long> {
    List<Major> findByBlock(Block block);

    boolean existsByCode(String code);
}