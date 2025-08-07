package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.Clazz;
import com.qui.career_orientation.entity.dto.request.ClazzRequest;
import com.qui.career_orientation.entity.dto.respond.ClazzResponse;

public interface ClazzService {
    ClazzResponse createClazz(ClazzRequest request);

    ClazzResponse getClazzById(Long id);

    List<ClazzResponse> getAllClazzes();

    ClazzResponse updateClazz(Long id, ClazzRequest request);

    void deleteClazz(Long id);

    Clazz getClazzEntityById(Long id);

    List<ClazzResponse> getClassesByTeacher(Long teacherId);

}