package com.qui.career_orientation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qui.career_orientation.entity.TestResult;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserId(Long userId);

    List<TestResult> findByUserIdIn(List<Long> userIds);

    List<TestResult> findByUserIdInOrderByCreatedAtDesc(List<Long> userIds);

}