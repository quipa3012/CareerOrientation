package com.qui.career_orientation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.qui.career_orientation.entity.Role;
import com.qui.career_orientation.entity.dto.respond.ApiRespond;
import com.qui.career_orientation.service.RoleService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Slf4j
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<ApiRespond<Role>> createRole(@RequestBody Role role) {
        Role created = roleService.create(role);
        return ResponseEntity.ok(ApiRespond.success("Tao role thanh cong", created));
    }

    @GetMapping("/{name}")
    public ResponseEntity<ApiRespond<Role>> getRoleByName(@PathVariable String name) {
        Role role = roleService.getByName(name);
        return ResponseEntity.ok(ApiRespond.success(null, role));
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<ApiRespond<?>> deleteRole(@PathVariable String name) {
        roleService.deleteByName(name);
        return ResponseEntity.ok(ApiRespond.success("Deleted role: " + name, null));
    }
}
