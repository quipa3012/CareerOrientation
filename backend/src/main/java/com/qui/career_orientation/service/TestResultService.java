package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.dto.TestResultDTO;
import com.qui.career_orientation.entity.dto.request.SubmitTestRequest;

public interface TestResultService {
    TestResultDTO submitTest(Long userId, SubmitTestRequest request);

    List<TestResultDTO> getResultsByUser(Long userId);
}