package com.qui.career_orientation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qui.career_orientation.entity.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Optional<Question> findByCode(String code);

    boolean existsByCode(String code);
}