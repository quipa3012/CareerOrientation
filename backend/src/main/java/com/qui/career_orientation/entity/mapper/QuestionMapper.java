package com.qui.career_orientation.entity.mapper;

import com.qui.career_orientation.entity.Question;
import com.qui.career_orientation.entity.dto.QuestionDTO;

public class QuestionMapper {
    public static QuestionDTO toDTO(Question entity) {
        return QuestionDTO.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .content(entity.getContent())
                .category(entity.getCategory())
                .build();
    }

    public static Question toEntity(QuestionDTO dto) {
        return Question.builder()
                .id(dto.getId())
                .code(dto.getCode())
                .content(dto.getContent())
                .category(dto.getCategory())
                .build();
    }

}