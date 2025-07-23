package com.qui.career_orientation.entity.mapper;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qui.career_orientation.entity.TestResult;
import com.qui.career_orientation.entity.dto.TestResultDTO;

public class TestResultMapper {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static TestResultDTO toDTO(TestResult entity) {
        Map<String, Integer> answers = new HashMap<>();
        try {
            answers = objectMapper.readValue(entity.getAnswers(),
                    new TypeReference<Map<String, Integer>>() {
                    });
        } catch (Exception e) {
            e.printStackTrace();
        }

        return TestResultDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .answers(answers)
                .predictedMajor(entity.getPredictedMajor())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}