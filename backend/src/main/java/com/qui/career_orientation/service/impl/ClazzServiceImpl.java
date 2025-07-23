package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.Clazz;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.ClazzRepository;
import com.qui.career_orientation.service.ClazzService;
import com.qui.career_orientation.util.constant.ErrorCode;

@Service
public class ClazzServiceImpl implements ClazzService {

    private final ClazzRepository clazzRepository;

    public ClazzServiceImpl(ClazzRepository clazzRepository) {
        this.clazzRepository = clazzRepository;
    }

    @Override
    public Clazz createClazz(String name) {
        if (clazzRepository.existsByName(name)) {
            throw new AppException(ErrorCode.CLAZZ_ALREADY_EXISTS);
        }

        Clazz clazz = new Clazz();
        clazz.setName(name);

        return clazzRepository.save(clazz);
    }

    @Override
    public Clazz getClazzById(Long id) {
        return clazzRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CLAZZ_NOT_FOUND));
    }

    @Override
    public List<Clazz> getAllClazzes() {
        return clazzRepository.findAll();
    }

    @Override
    public Clazz updateClazz(Long id, String newName) {
        Clazz clazz = clazzRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CLAZZ_NOT_FOUND));

        if (!clazz.getName().equals(newName) && clazzRepository.existsByName(newName)) {
            throw new AppException(ErrorCode.CLAZZ_ALREADY_EXISTS);
        }

        clazz.setName(newName);
        return clazzRepository.save(clazz);
    }

    @Override
    public void deleteClazz(Long id) {
        if (!clazzRepository.existsById(id)) {
            throw new AppException(ErrorCode.CLAZZ_NOT_FOUND);
        }

        clazzRepository.deleteById(id);
    }
}