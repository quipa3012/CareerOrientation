package com.qui.career_orientation.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.ClassUser;
import com.qui.career_orientation.entity.Clazz;
import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.respond.ClassMemberResponse;
import com.qui.career_orientation.entity.dto.respond.ClazzSimpleResponse;
import com.qui.career_orientation.entity.dto.respond.TeacherSimpleResponse;
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
    public ClazzSimpleResponse joinClazzWithPassword(Long clazzId, Long userId, String password) {
        Clazz clazz = clazzRepository.findById(clazzId)
                .orElseThrow(() -> new AppException(ErrorCode.CLAZZ_NOT_FOUND));

        if (classUserRepository.existsByClazz_IdAndUser_Id(clazzId, userId)) {
            throw new AppException(ErrorCode.USER_ALREADY_IN_CLAZZ);
        }

        String stored = clazz.getPassword();
        if (stored != null && !stored.isBlank()) {
            if (!stored.equals(password)) {
                throw new AppException(ErrorCode.INVALID_CLAZZ_PASSWORD);
            }
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        ClassUser classUser = ClassUser.builder()
                .clazz(clazz)
                .user(user)
                .isTeacher(false)
                .build();

        classUserRepository.save(classUser);
        log.info("User '{}' joined clazz '{}'", user.getUsername(), clazz.getName());

        return ClazzSimpleResponse.builder()
                .id(clazz.getId())
                .name(clazz.getName())
                .password(clazz.getPassword())
                .teacher(TeacherSimpleResponse.builder()
                        .id(clazz.getTeacher().getId())
                        .fullName(clazz.getTeacher().getFullName())
                        .email(clazz.getTeacher().getEmail())
                        .build())
                .build();
    }

    @Override
    public List<ClassUser> getUsersInClazz(Long clazzId) {
        if (!clazzRepository.existsById(clazzId)) {
            throw new AppException(ErrorCode.CLAZZ_NOT_FOUND);
        }
        return classUserRepository.findByClazz_Id(clazzId);
    }

    @Override
    public List<ClassMemberResponse> getClassMembers(Long clazzId) {
        if (!clazzRepository.existsById(clazzId)) {
            throw new AppException(ErrorCode.CLAZZ_NOT_FOUND);
        }

        return classUserRepository.findByClazz_Id(clazzId)
                .stream()
                .map(cu -> ClassMemberResponse.builder()
                        .id(cu.getUser().getId())
                        .username(cu.getUser().getUsername())
                        .fullName(cu.getUser().getFullName())
                        .email(cu.getUser().getEmail())
                        .profileImageUrl(cu.getUser().getProfileImageUrl())
                        .roleName(cu.getUser().getRole() != null ? cu.getUser().getRole().getName() : null)
                        .isTeacher(cu.getIsTeacher())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ClazzSimpleResponse> getMyClazzes(Long userId) {
        return classUserRepository.findByUser_Id(userId)
                .stream()
                .map(ClassUser::getClazz)
                .map(clazz -> ClazzSimpleResponse.builder()
                        .id(clazz.getId())
                        .name(clazz.getName())
                        .password(clazz.getPassword())
                        .teacher(TeacherSimpleResponse.builder()
                                .id(clazz.getTeacher().getId())
                                .fullName(clazz.getTeacher().getFullName())
                                .email(clazz.getTeacher().getEmail())
                                .build())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void removeUserFromClazz(Long clazzId, Long userId) {
        ClassUser classUser = classUserRepository.findByClazz_IdAndUser_Id(clazzId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_CLAZZ));

        classUserRepository.delete(classUser);
        log.warn("Removed user '{}' from clazz '{}'", userId, clazzId);
    }
}
