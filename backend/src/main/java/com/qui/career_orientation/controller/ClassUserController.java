package com.qui.career_orientation.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.ClassUser;
import com.qui.career_orientation.entity.dto.respond.ClassMemberResponse;
import com.qui.career_orientation.entity.dto.respond.ClazzSimpleResponse;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.UserRepository;
import com.qui.career_orientation.service.ClassUserService;
import com.qui.career_orientation.util.SecurityUtil;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/class-users")
@RequiredArgsConstructor
public class ClassUserController {

    private final UserRepository userRepository;
    private final ClassUserService classUserService;
    private final SecurityUtil securityUtil;

    @PostMapping("/{clazzId}/users/{userId}")
    public ResponseEntity<ClassUser> addUserToClazz(
            @PathVariable Long clazzId,
            @PathVariable Long userId,
            @RequestParam(defaultValue = "false") Boolean isTeacher) {

        return ResponseEntity.ok(
                classUserService.addUserToClazz(clazzId, userId, isTeacher));
    }

    @PostMapping("/{clazzId}/join")
    public ResponseEntity<ClazzSimpleResponse> joinClazzWithPassword(
            @PathVariable Long clazzId,
            @RequestParam String password,
            Principal principal) {

        Long userId = getUserIdFromPrincipal(principal);
        return ResponseEntity.ok(
                classUserService.joinClazzWithPassword(clazzId, userId, password));
    }

    @GetMapping("/{clazzId}/members")
    public ResponseEntity<List<ClassMemberResponse>> getClassMembers(@PathVariable Long clazzId) {
        return ResponseEntity.ok(
                classUserService.getClassMembers(clazzId));
    }

    @GetMapping("/my-classes")
    public List<ClazzSimpleResponse> getMyClasses() {
        Long userId = securityUtil.getCurrentUserId();
        return classUserService.getMyClazzes(userId);
    }

    @DeleteMapping("/{clazzId}/{userId}")
    public ResponseEntity<Void> removeUserFromClazz(
            @PathVariable Long clazzId,
            @PathVariable Long userId) {

        classUserService.removeUserFromClazz(clazzId, userId);
        return ResponseEntity.noContent().build();
    }

    private Long getUserIdFromPrincipal(Principal principal) {
        if (principal instanceof JwtAuthenticationToken jwtAuth) {
            String username = jwtAuth.getToken().getSubject();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND))
                    .getId();
        }
        throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    @DeleteMapping("/{clazzId}/leave")
    public ResponseEntity<Void> leaveClazz(@PathVariable Long clazzId) {
        Long userId = securityUtil.getCurrentUserId();
        classUserService.removeUserFromClazz(clazzId, userId);
        return ResponseEntity.noContent().build();
    }

}
