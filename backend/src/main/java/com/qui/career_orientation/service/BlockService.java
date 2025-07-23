package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.Block;

public interface BlockService {
    List<Block> getAllBlocks();

    Block getBlockByModelLabel(Integer modelLabel);

    Block createBlock(Block block);
}