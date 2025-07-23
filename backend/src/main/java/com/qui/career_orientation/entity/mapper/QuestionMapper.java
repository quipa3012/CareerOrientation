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
}