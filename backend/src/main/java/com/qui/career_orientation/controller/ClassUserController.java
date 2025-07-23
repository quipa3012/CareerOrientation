package com.qui.career_orientation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.ClassUser;
import com.qui.career_orientation.service.ClassUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/class-users")
@RequiredArgsConstructor
public class ClassUserController {

    private final ClassUserService classUserService;

    @PostMapping("/add")
    public ResponseEntity<ClassUser> addUserToClazz(@RequestParam Long classId,
            @RequestParam Long userId,
            @RequestParam boolean isTeacher) {
        ClassUser classUser = classUserService.addUserToClazz(classId, userId, isTeacher);
        return ResponseEntity.ok(classUser);
    }

    @GetMapping("/clazz/{classId}")
    public ResponseEntity<List<ClassUser>> getUsersInClazz(@PathVariable Long classId) {
        return ResponseEntity.ok(classUserService.getUsersInClazz(classId));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeUserFromClazz(@RequestParam Long classId,
            @RequestParam Long userId) {
        classUserService.removeUserFromClazz(classId, userId);
        return ResponseEntity.noContent().build();
    }
}