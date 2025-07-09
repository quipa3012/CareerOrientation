package com.qui.career_orientation.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    // Trả về thư mục relative (bên trong static)
    private final String AVATAR_UPLOAD_DIR = "src/main/resources/static/uploads/avatars/";

    @Override
    public String storeAvatarFile(String username, MultipartFile file) {
        try {
            Path uploadPath = Paths.get(AVATAR_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !originalFilename.contains(".")) {
                throw new AppException(ErrorCode.INVALID_FILE_NAME);
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
            if (!List.of(".jpg", ".jpeg", ".png").contains(extension)) {
                throw new AppException(ErrorCode.INVALID_FILE_TYPE);
            }

            String fileName = username + "_" + System.currentTimeMillis() + extension;
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);
            log.info("✅ Avatar saved to: {}", filePath.toAbsolutePath());

            // Trả về relative path để frontend tự xử lý prefix
            return "/uploads/avatars/" + fileName;

        } catch (IOException e) {
            log.error("❌ Failed to store avatar file", e);
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
            log.info("✅ Deleted avatar file: {}", filePath.toAbsolutePath());
        } catch (IOException e) {
            log.warn("⚠️ Failed to delete avatar file: {}", filePath.toAbsolutePath(), e);
        }
    }
}
