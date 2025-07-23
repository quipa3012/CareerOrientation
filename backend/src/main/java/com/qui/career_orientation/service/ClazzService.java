package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.Clazz;

public interface ClazzService {

    Clazz createClazz(String name);

    Clazz getClazzById(Long id);

    List<Clazz> getAllClazzes();

    Clazz updateClazz(Long id, String newName);

    void deleteClazz(Long id);
}