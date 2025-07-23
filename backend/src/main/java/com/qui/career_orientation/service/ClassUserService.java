package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.ClassUser;

public interface ClassUserService {

    ClassUser addUserToClazz(Long clazzId, Long userId, Boolean isTeacher);

    List<ClassUser> getUsersInClazz(Long clazzId);

    void removeUserFromClazz(Long clazzId, Long userId);
}