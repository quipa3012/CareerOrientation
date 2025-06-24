package com.qui.career_orientation.entity.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.qui.career_orientation.entity.PermissionRole;
import com.qui.career_orientation.entity.dto.respond.PermissionRoleResponseDTO;

@Component
public class PermissionRoleMapper {

    public PermissionRoleResponseDTO toDTO(PermissionRole pr) {
        if (pr == null)
            return null;

        return PermissionRoleResponseDTO.builder()
                .id(pr.getId())
                .roleName(pr.getRole().getName())
                .permissionName(pr.getPermission().getName())
                .build();
    }

    public List<PermissionRoleResponseDTO> toDTOList(List<PermissionRole> entities) {
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}