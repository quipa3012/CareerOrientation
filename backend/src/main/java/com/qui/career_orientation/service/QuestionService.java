package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.dto.QuestionDTO;

public interface QuestionService {
    List<QuestionDTO> getAllQuestions();

    QuestionDTO updateContent(Long id, String content);

    QuestionDTO getById(Long id);
}