package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.Block;
import com.qui.career_orientation.entity.Major;
import com.qui.career_orientation.entity.dto.request.MajorRequest;
import com.qui.career_orientation.entity.dto.respond.MajorRespond;
import com.qui.career_orientation.entity.mapper.MajorMapper;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.BlockRepository;
import com.qui.career_orientation.repository.MajorRepository;
import com.qui.career_orientation.service.MajorService;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MajorServiceImpl implements MajorService {

        private final MajorRepository majorRepository;
        private final BlockRepository blockRepository;

        @Override
        public List<MajorRespond> getAllMajors() {
                return majorRepository.findAll(Sort.by(
                                "name")).stream()
                                .map(MajorMapper::toMajorRespond)
                                .toList();
        }

        @Override
        public MajorRespond getMajorById(Long id) {
                Major major = majorRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));
                return MajorMapper.toMajorRespond(major);
        }

        @Override
        public MajorRespond createMajor(MajorRequest request) {
                Block block = blockRepository.findById(request.getBlockId())
                                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));

                Major major = Major.builder()
                                .code(request.getCode())
                                .name(request.getName())
                                .description(request.getDescription())
                                .block(block)
                                .build();

                Major savedMajor = majorRepository.save(major);
                return MajorMapper.toMajorRespond(savedMajor);
        }

        @Override
        public MajorRespond updateMajor(Long id, MajorRequest request) {
                Major existingMajor = majorRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));

                Block block = blockRepository.findById(request.getBlockId())
                                .orElseThrow(
                                                () -> new AppException(ErrorCode.BLOCK_NOT_FOUND));

                existingMajor.setCode(request.getCode());
                existingMajor.setName(request.getName());
                existingMajor.setDescription(request.getDescription());
                existingMajor.setBlock(block);

                Major savedMajor = majorRepository.save(existingMajor);
                return MajorMapper.toMajorRespond(savedMajor);
        }

        @Override
        public void deleteMajor(Long id) {
                Major existingMajor = majorRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));
                majorRepository.delete(existingMajor);
        }

        @Override
        public List<MajorRespond> getMajorsByBlock(Long blockId) {
                Block block = blockRepository.findById(blockId)
                                .orElseThrow(
                                                () -> new AppException(ErrorCode.BLOCK_NOT_FOUND));
                return majorRepository.findByBlock(block).stream()
                                .map(MajorMapper::toMajorRespond)
                                .toList();
        }
}