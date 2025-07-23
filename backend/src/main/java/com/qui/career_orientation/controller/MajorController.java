package com.qui.career_orientation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.dto.request.MajorRequest;
import com.qui.career_orientation.entity.dto.respond.MajorRespond;
import com.qui.career_orientation.service.MajorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/majors")
@RequiredArgsConstructor
public class MajorController {

    private final MajorService majorService;

    @GetMapping
    public List<MajorRespond> getAllMajors() {
        return majorService.getAllMajors();
    }

    @GetMapping("/{id}")
    public MajorRespond getMajorById(@PathVariable Long id) {
        return majorService.getMajorById(id);
    }

    @PostMapping
    public MajorRespond createMajor(@RequestBody MajorRequest request) {
        return majorService.createMajor(request);
    }

    @PutMapping("/{id}")
    public MajorRespond updateMajor(@PathVariable Long id, @RequestBody MajorRequest request,
            @RequestParam Long blockId) {
        return majorService.updateMajor(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteMajor(@PathVariable Long id) {
        majorService.deleteMajor(id);
    }

    @GetMapping("/block/{blockId}")
    public List<MajorRespond> getMajorsByBlock(@PathVariable Long blockId) {
        return majorService.getMajorsByBlock(blockId);
    }
}