package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.ClassUser;
import com.qui.career_orientation.entity.dto.respond.ClassMemberResponse;
import com.qui.career_orientation.entity.dto.respond.ClazzSimpleResponse;

public interface ClassUserService {
    ClassUser addUserToClazz(Long clazzId, Long userId, Boolean isTeacher);

    ClazzSimpleResponse joinClazzWithPassword(Long clazzId, Long userId, String password);

    List<ClassUser> getUsersInClazz(Long clazzId);

    List<ClassMemberResponse> getClassMembers(Long clazzId);

    List<ClazzSimpleResponse> getMyClazzes(Long userId);

    void removeUserFromClazz(Long clazzId, Long userId);
}
