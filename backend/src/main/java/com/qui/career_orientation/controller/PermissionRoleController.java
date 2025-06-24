package com.qui.career_orientation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.PermissionRole;
import com.qui.career_orientation.entity.dto.request.PermissionRoleRequestDTO;
import com.qui.career_orientation.entity.dto.respond.ApiRespond;
import com.qui.career_orientation.entity.dto.respond.PermissionRoleResponseDTO;
import com.qui.career_orientation.entity.mapper.PermissionRoleMapper;
import com.qui.career_orientation.service.PermissionRoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/permission-roles")
@RequiredArgsConstructor
public class PermissionRoleController {

    private final PermissionRoleService permissionRoleService;
    private final PermissionRoleMapper permissionRoleMapper;

    @GetMapping("/{roleName}")
    public ResponseEntity<ApiRespond<List<PermissionRoleResponseDTO>>> getPermissionsByRole(
            @PathVariable String roleName) {
        List<PermissionRole> entities = permissionRoleService.getByRoleName(roleName);
        List<PermissionRoleResponseDTO> dtos = permissionRoleMapper.toDTOList(entities);
        return ResponseEntity.ok(ApiRespond.success("Success", dtos));
    }

    @PostMapping
    public ResponseEntity<ApiRespond<PermissionRoleResponseDTO>> addPermissionToRole(
            @RequestBody PermissionRoleRequestDTO request) {
        PermissionRole created = permissionRoleService.addPermissionToRole(
                request.getRoleName(), request.getPermissionName());
        return ResponseEntity.ok(ApiRespond.success("Permission added", permissionRoleMapper.toDTO(created)));
    }

    @DeleteMapping
    public ResponseEntity<ApiRespond<?>> removePermissionFromRole(@RequestBody PermissionRoleRequestDTO request) {
        permissionRoleService.removePermissionFromRole(request.getRoleName(), request.getPermissionName());
        return ResponseEntity.ok(ApiRespond.success("Permission removed", null));
    }
}