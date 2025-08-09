package com.qui.career_orientation.entity.dto.respond;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassMemberResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String profileImageUrl;
    private String roleName;
    private Boolean isTeacher;
}