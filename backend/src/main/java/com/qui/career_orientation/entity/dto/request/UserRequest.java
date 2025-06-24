package com.qui.career_orientation.entity.dto.request;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
}
