package com.qui.career_orientation.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qui.career_orientation.entity.Block;
import com.qui.career_orientation.entity.TestResult;
import com.qui.career_orientation.entity.dto.TestResultDTO;
import com.qui.career_orientation.entity.dto.request.SubmitTestRequest;
import com.qui.career_orientation.entity.mapper.TestResultMapper;
import com.qui.career_orientation.repository.BlockRepository;
import com.qui.career_orientation.repository.ClassUserRepository;
import com.qui.career_orientation.repository.TestResultRepository;
import com.qui.career_orientation.service.TestResultService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestResultServiceImpl implements TestResultService {

    private final TestResultRepository testResultRepository;
    private final RestTemplate restTemplate;
    private final BlockRepository blockRepository;
    private final ObjectMapper objectMapper;
    private final ClassUserRepository classUserRepository;

    private static final String AI_URL = "http://localhost:5000/predict";

    @Override
    public TestResultDTO submitTest(Long userId, SubmitTestRequest request) {
        try {
            Map<String, Integer> answers = request.getAnswers();

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    AI_URL,
                    answers,
                    Map.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("AI API call failed: " + response.getStatusCode());
            }

            Map responseBody = response.getBody();
            if (responseBody == null || !responseBody.containsKey("prediction")) {
                throw new RuntimeException("AI API response body is null or missing 'prediction' key");
            }
            Integer predictionLabel = (Integer) responseBody.get("prediction");

            Block predictedBlock = blockRepository.findByModelLabel(predictionLabel)
                    .orElseThrow(() -> new RuntimeException("Block not found for modelLabel: " + predictionLabel));

            TestResult result = TestResult.builder()
                    .userId(userId)
                    .answers(objectMapper.writeValueAsString(answers))
                    .predictedMajor(predictedBlock.getName())
                    .createdAt(LocalDateTime.now())
                    .build();

            testResultRepository.save(result);

            return TestResultMapper.toDTO(result);

        } catch (Exception ex) {
            throw new RuntimeException("Error calling AI service: " + ex.getMessage(), ex);
        }
    }

    @Override
    public List<TestResultDTO> getResultsByUser(Long userId) {
        return testResultRepository.findByUserId(userId)
                .stream()
                .map(TestResultMapper::toDTO)
                .toList();
    }

    @Override
    public List<TestResultDTO> getResultsByClass(Long clazzId) {
        List<Long> studentIds = classUserRepository.findStudentIdsByClazzId(clazzId);
        if (studentIds.isEmpty())
            return List.of();

        return testResultRepository.findByUserIdInOrderByCreatedAtDesc(studentIds)
                .stream()
                .map(TestResultMapper::toDTO)
                .toList();
    }

}
