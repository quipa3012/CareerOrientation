package com.qui.career_orientation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.qui.career_orientation.entity.Permission;
import com.qui.career_orientation.entity.dto.respond.ApiRespond;
import com.qui.career_orientation.service.PermissionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Slf4j
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping
    public ResponseEntity<ApiRespond<Permission>> createPermission(@RequestBody Permission permission) {
        Permission created = permissionService.create(permission);
        return ResponseEntity.ok(ApiRespond.success("Tao Permission thanh cong", created));
    }

    @GetMapping
    public ResponseEntity<ApiRespond<List<Permission>>> getAllPermissions() {
        List<Permission> permissions = permissionService.getAll();
        return ResponseEntity.ok(ApiRespond.success("Get all permission", permissions));
    }

    @GetMapping("/{name}")
    public ResponseEntity<ApiRespond<Permission>> getPermissionByName(@PathVariable String name) {
        Permission permission = permissionService.getByName(name);
        return ResponseEntity.ok(ApiRespond.success("Get permission by name", permission));
    }

    @PutMapping("/{name}")
    public ResponseEntity<ApiRespond<Permission>> updatePermission(
            @PathVariable String name,
            @RequestBody Permission updatedPermission) {
        Permission permission = permissionService.update(name, updatedPermission);
        return ResponseEntity.ok(ApiRespond.success("Update permission complete", permission));
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<ApiRespond<?>> deletePermission(@PathVariable String name) {
        permissionService.deleteByName(name);
        return ResponseEntity.ok(ApiRespond.success("Deleted permission: " + name, null));
    }
}
