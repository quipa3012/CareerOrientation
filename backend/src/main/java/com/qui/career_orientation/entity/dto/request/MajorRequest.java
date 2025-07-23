package com.qui.career_orientation.entity.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MajorRequest {
    private String code;
    private String name;
    private String description;
    private Long blockId;
}