package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.Block;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.BlockRepository;
import com.qui.career_orientation.service.BlockService;
import com.qui.career_orientation.util.constant.ErrorCode;

@Service
public class BlockServiceImpl implements BlockService {

    @Autowired
    private BlockRepository blockRepository;

    @Override
    public List<Block> getAllBlocks() {
        return blockRepository.findAll();
    }

    @Override
    public Block getBlockByModelLabel(Integer modelLabel) {
        return blockRepository.findByModelLabel(modelLabel)
                .orElseThrow(() -> new AppException(ErrorCode.BLOCK_NOT_FOUND));
    }

    @Override
    public Block createBlock(Block block) {
        return blockRepository.save(block);
    }
}