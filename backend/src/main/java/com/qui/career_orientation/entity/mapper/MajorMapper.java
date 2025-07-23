package com.qui.career_orientation.entity.mapper;

import com.qui.career_orientation.entity.Block;
import com.qui.career_orientation.entity.Major;
import com.qui.career_orientation.entity.dto.respond.BlockRespond;
import com.qui.career_orientation.entity.dto.respond.MajorRespond;

public class MajorMapper {

    public static BlockRespond toBlockRespond(Block block) {
        if (block == null) {
            return null;
        }
        return BlockRespond.builder()
                .id(block.getId())
                .code(block.getCode())
                .name(block.getName())
                .build();
    }

    public static MajorRespond toMajorRespond(Major major) {
        if (major == null) {
            return null;
        }
        return MajorRespond.builder()
                .id(major.getId())
                .code(major.getCode())
                .name(major.getName())
                .description(major.getDescription())
                .block(toBlockRespond(major.getBlock()))
                .build();
    }

    public static Major toMajorEntity(MajorRespond MajorRespond, Block block) {
        if (MajorRespond == null) {
            return null;
        }
        return Major.builder()
                .id(MajorRespond.getId())
                .code(MajorRespond.getCode())
                .name(MajorRespond.getName())
                .description(MajorRespond.getDescription())
                .block(block)
                .build();
    }
}