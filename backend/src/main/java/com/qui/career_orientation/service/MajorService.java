package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.dto.request.MajorRequest;
import com.qui.career_orientation.entity.dto.respond.MajorRespond;

public interface MajorService {
    List<MajorRespond> getAllMajors();

    MajorRespond getMajorById(Long id);

    MajorRespond createMajor(MajorRequest major);

    MajorRespond updateMajor(Long id, MajorRequest updatedMajor);

    void deleteMajor(Long id);

    List<MajorRespond> getMajorsByBlock(Long blockId);
}