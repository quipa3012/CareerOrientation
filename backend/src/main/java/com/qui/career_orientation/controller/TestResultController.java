package com.qui.career_orientation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.dto.TestResultDTO;
import com.qui.career_orientation.entity.dto.request.SubmitTestRequest;
import com.qui.career_orientation.service.TestResultService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test-results")
@RequiredArgsConstructor
public class TestResultController {

    private final TestResultService testResultService;

    @PostMapping
    public ResponseEntity<TestResultDTO> submitTest(
            @RequestParam("userId") Long userId,
            @RequestBody SubmitTestRequest request) {
        TestResultDTO resultDTO = testResultService.submitTest(userId, request);
        return ResponseEntity.ok(resultDTO);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<TestResultDTO>> getResultsByUser(@PathVariable Long userId) {
        List<TestResultDTO> results = testResultService.getResultsByUser(userId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/class/{clazzId}")
    public ResponseEntity<List<TestResultDTO>> getResultsByClass(@PathVariable Long clazzId) {
        return ResponseEntity.ok(testResultService.getResultsByClass(clazzId));
    }

}