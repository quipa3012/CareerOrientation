package com.qui.career_orientation.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String storeAvatarFile(String username, MultipartFile file);

    void deleteAvatarFile(String profileImageUrl);
}
