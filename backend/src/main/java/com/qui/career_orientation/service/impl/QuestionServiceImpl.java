package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.dto.QuestionDTO;
import com.qui.career_orientation.entity.mapper.QuestionMapper;
import com.qui.career_orientation.repository.QuestionRepository;
import com.qui.career_orientation.service.QuestionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;

    @Override
    public List<QuestionDTO> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(QuestionMapper::toDTO)
                .toList();
    }
}