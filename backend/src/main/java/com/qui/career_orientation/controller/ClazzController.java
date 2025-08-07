package com.qui.career_orientation.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.request.ClazzRequest;
import com.qui.career_orientation.entity.dto.respond.ClazzResponse;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.service.ClazzService;
import com.qui.career_orientation.service.UserService;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClazzController {

    private final ClazzService clazzService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ClazzResponse> createClazz(
            @RequestBody ClazzRequest request,
            Principal principal) {
        User currentUser = userService.getUserByUserName(principal.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        request.setTeacherId(currentUser.getId());

        ClazzResponse saved = clazzService.createClazz(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClazzResponse> getClazzById(@PathVariable Long id) {
        return ResponseEntity.ok(clazzService.getClazzById(id));
    }

    @GetMapping
    public ResponseEntity<List<ClazzResponse>> getAllClazzes() {
        return ResponseEntity.ok(clazzService.getAllClazzes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClazzResponse> updateClazz(
            @PathVariable Long id,
            @RequestBody ClazzRequest request) {
        return ResponseEntity.ok(clazzService.updateClazz(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClazz(@PathVariable Long id) {
        clazzService.deleteClazz(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-classes")
    public ResponseEntity<List<ClazzResponse>> getMyClasses(Principal principal) {
        User currentUser = userService.getUserByUserName(principal.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<ClazzResponse> myClasses = clazzService.getClassesByTeacher(currentUser.getId());
        return ResponseEntity.ok(myClasses);
    }

}