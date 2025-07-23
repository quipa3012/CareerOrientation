package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.ClassUser;
import com.qui.career_orientation.entity.Clazz;
import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.ClassUserRepository;
import com.qui.career_orientation.repository.ClazzRepository;
import com.qui.career_orientation.repository.UserRepository;
import com.qui.career_orientation.service.ClassUserService;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassUserServiceImpl implements ClassUserService {

    private final ClassUserRepository classUserRepository;
    private final ClazzRepository clazzRepository;
    private final UserRepository userRepository;

    @Override
    public ClassUser addUserToClazz(Long clazzId, Long userId, Boolean isTeacher) {
        if (classUserRepository.existsByClazz_IdAndUser_Id(clazzId, userId)) {
            throw new AppException(ErrorCode.USER_ALREADY_IN_CLAZZ);
        }

        Clazz clazz = clazzRepository.findById(clazzId)
                .orElseThrow(() -> new AppException(ErrorCode.CLAZZ_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        ClassUser classUser = ClassUser.builder()
                .clazz(clazz)
                .user(user)
                .isTeacher(isTeacher)
                .build();

        classUserRepository.save(classUser);
        log.info("Added user '{}' to clazz '{}' as '{}'", user.getUsername(), clazz.getName(),
                isTeacher ? "Teacher" : "Student");
        return classUser;
    }

    @Override
    public List<ClassUser> getUsersInClazz(Long clazzId) {
        if (!clazzRepository.existsById(clazzId)) {
            throw new AppException(ErrorCode.CLAZZ_NOT_FOUND);
        }
        return classUserRepository.findByClazz_Id(clazzId);
    }

    @Override
    public void removeUserFromClazz(Long clazzId, Long userId) {
        ClassUser classUser = classUserRepository.findByClazz_IdAndUser_Id(clazzId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_CLAZZ));

        classUserRepository.delete(classUser);
        log.warn("Removed user '{}' from clazz '{}'", userId, clazzId);
    }
}