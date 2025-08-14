package com.qui.career_orientation.entity.dto.respond;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponse {
    Long id;
    String title;
    String description;
    String fileUrl;
    LocalDateTime updatedAt;
    String updatedBy;
}
