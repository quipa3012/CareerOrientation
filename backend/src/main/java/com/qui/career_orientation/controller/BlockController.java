package com.qui.career_orientation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.Block;
import com.qui.career_orientation.service.BlockService;

@RestController
@RequestMapping("/api/blocks")
public class BlockController {

    @Autowired
    private BlockService blockService;

    @GetMapping
    public List<Block> getAllBlocks() {
        return blockService.getAllBlocks();
    }

    @GetMapping("/{modelLabel}")
    public Block getBlockByModelLabel(@PathVariable Integer modelLabel) {
        return blockService.getBlockByModelLabel(modelLabel);
    }

    @PostMapping
    public Block createBlock(@RequestBody Block block) {
        return blockService.createBlock(block);
    }
}