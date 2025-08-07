package com.qui.career_orientation.entity.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClazzRequest {
    private String name;
    private String password;
    private Long teacherId;
}