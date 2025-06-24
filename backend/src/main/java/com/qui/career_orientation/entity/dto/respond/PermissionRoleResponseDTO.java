package com.qui.career_orientation.entity.dto.respond;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PermissionRoleResponseDTO {
    private Long id;
    private String roleName;
    private String permissionName;
}