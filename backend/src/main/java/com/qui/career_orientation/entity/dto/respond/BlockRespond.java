package com.qui.career_orientation.entity.dto.respond;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockRespond {
    private Long id;
    private String code;
    private String name;
}
