package com.qui.career_orientation.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.service.StorageService;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StorageServiceImpl implements StorageService {

    private final String AVATAR_UPLOAD_DIR = Paths.get("src/main/resources/static/uploads/avatars").toString();

    @Override
    public String storeAvatarFile(String username, MultipartFile file) {
        try {
            Path uploadPath = Paths.get(AVATAR_UPLOAD_DIR);
            log.info("storeAvatarFile called. uploadPath={}, fileName={}, empty={}",
                    uploadPath.toAbsolutePath(), file.getOriginalFilename(), file.isEmpty());

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload dir: {}", uploadPath.toAbsolutePath());
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !originalFilename.contains(".")) {
                log.warn("Invalid originalFilename: {}", originalFilename);
                throw new AppException(ErrorCode.INVALID_FILE_NAME);
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
            if (!List.of(".jpg", ".jpeg", ".png").contains(extension)) {
                log.warn("Invalid file type: {}", extension);
                throw new AppException(ErrorCode.INVALID_FILE_TYPE);
            }

            String fileName = username + "_" + System.currentTimeMillis() + extension;
            Path filePath = uploadPath.resolve(fileName).normalize();
            log.info("Attempting to copy uploaded file to: {}", filePath.toAbsolutePath());

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Saved avatar file: {}", filePath.toAbsolutePath());

            return "/uploads/avatars/" + fileName;

        } catch (IOException e) {
            log.error("Failed to store avatar file", e);
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    @Override
    public void deleteAvatarFile(String profileImageUrl) {
        if (profileImageUrl == null)
            return;

        String fileName = Paths.get(profileImageUrl).getFileName().toString();
        Path filePath = Paths.get(AVATAR_UPLOAD_DIR).resolve(fileName);

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
        }
    }
}
