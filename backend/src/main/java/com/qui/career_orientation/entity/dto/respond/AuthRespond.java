package com.qui.career_orientation.entity.dto.respond;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRespond {
    private String accesstoken;
    private boolean authenticated;
    private String role;
}
