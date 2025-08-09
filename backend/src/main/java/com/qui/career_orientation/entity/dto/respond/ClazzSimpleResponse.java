package com.qui.career_orientation.entity.dto.respond;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClazzSimpleResponse {
    private Long id;
    private String name;
    private String password;

    private TeacherSimpleResponse teacher;
}