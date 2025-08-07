package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.dto.QuestionDTO;
import com.qui.career_orientation.entity.mapper.QuestionMapper;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.QuestionRepository;
import com.qui.career_orientation.service.QuestionService;
import com.qui.career_orientation.util.constant.ErrorCode;

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

    @Override
    public QuestionDTO updateContent(Long id, String content) {
        var question = questionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));

        question.setContent(content);

        var updated = questionRepository.save(question);
        return QuestionMapper.toDTO(updated);
    }

    @Override
    public QuestionDTO getById(Long id) {
        var question = questionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));
        return QuestionMapper.toDTO(question);
    }
}