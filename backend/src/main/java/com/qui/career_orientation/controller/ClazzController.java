package com.qui.career_orientation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.Clazz;
import com.qui.career_orientation.service.ClazzService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClazzController {

    private final ClazzService clazzService;

    @PostMapping
    public ResponseEntity<Clazz> createClazz(@RequestParam String name) {
        Clazz clazz = clazzService.createClazz(name);
        return ResponseEntity.ok(clazz);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clazz> getClazzById(@PathVariable Long id) {
        return ResponseEntity.ok(clazzService.getClazzById(id));
    }

    @GetMapping
    public ResponseEntity<List<Clazz>> getAllClazzes() {
        return ResponseEntity.ok(clazzService.getAllClazzes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clazz> updateClazz(
            @PathVariable Long id,
            @RequestParam String name) {
        Clazz updatedClazz = clazzService.updateClazz(id, name);
        return ResponseEntity.ok(updatedClazz);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClazz(@PathVariable Long id) {
        clazzService.deleteClazz(id);
        return ResponseEntity.noContent().build();
    }
}
