package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.Clazz;
import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.request.ClazzRequest;
import com.qui.career_orientation.entity.dto.respond.ClazzResponse;
import com.qui.career_orientation.entity.mapper.ClazzMapper;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.ClazzRepository;
import com.qui.career_orientation.repository.UserRepository;
import com.qui.career_orientation.service.ClazzService;
import com.qui.career_orientation.util.constant.ErrorCode;

@Service
public class ClazzServiceImpl implements ClazzService {

    private final ClazzRepository clazzRepository;
    private final ClazzMapper clazzMapper;
    private final UserRepository userRepository;

    public ClazzServiceImpl(ClazzRepository clazzRepository, ClazzMapper clazzMapper, UserRepository userRepository) {
        this.clazzRepository = clazzRepository;
        this.clazzMapper = clazzMapper;
        this.userRepository = userRepository;
    }

    @Override
    public ClazzResponse createClazz(ClazzRequest request) {
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Clazz clazz = new Clazz();
        clazz.setName(request.getName());
        clazz.setPassword(request.getPassword());
        clazz.setTeacher(teacher);

        Clazz saved = clazzRepository.save(clazz);
        return clazzMapper.toClazzResponse(saved);
    }

    @Override
    public ClazzResponse getClazzById(Long id) {
        Clazz clazz = clazzRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CLAZZ_NOT_FOUND));
        return clazzMapper.toClazzResponse(clazz);
    }

    @Override
    public Clazz getClazzEntityById(Long id) {
        return clazzRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CLAZZ_NOT_FOUND));
    }

    @Override
    public List<ClazzResponse> getAllClazzes() {
        return clazzRepository.findAll().stream()
                .map(clazzMapper::toClazzResponse)
                .toList();
    }

    @Override
    public ClazzResponse updateClazz(Long id, ClazzRequest request) {
        Clazz clazz = clazzRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CLAZZ_NOT_FOUND));

        if (!clazz.getName().equals(request.getName()) && clazzRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CLAZZ_ALREADY_EXISTS);
        }

        clazz.setName(request.getName());
        clazz.setPassword(request.getPassword());
        Clazz updated = clazzRepository.save(clazz);
        return clazzMapper.toClazzResponse(updated);
    }

    @Override
    public void deleteClazz(Long id) {
        if (!clazzRepository.existsById(id)) {
            throw new AppException(ErrorCode.CLAZZ_NOT_FOUND);
        }
        clazzRepository.deleteById(id);
    }

    @Override
    public List<ClazzResponse> getClassesByTeacher(Long teacherId) {
        List<Clazz> classes = clazzRepository.findByTeacherId(teacherId);
        return classes.stream()
                .map(clazzMapper::toClazzResponse)
                .toList();
    }

}