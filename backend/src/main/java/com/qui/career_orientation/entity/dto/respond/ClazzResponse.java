package com.qui.career_orientation.entity.dto.respond;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClazzResponse {
    private Long id;
    private String name;
    private String password;

    private UserResponse teacher;
    private List<AnnouncementResponse> announcements;
}