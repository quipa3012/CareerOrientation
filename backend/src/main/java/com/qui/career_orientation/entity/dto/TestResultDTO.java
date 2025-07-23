package com.qui.career_orientation.entity.dto;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResultDTO {
    private Long id;
    private Long userId;
    private Map<String, Integer> answers;
    private String predictedMajor;
    private LocalDateTime createdAt;
}
