package com.qui.career_orientation.entity.dto.respond;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private String createdAt;

    private UserResponse createdBy;
}