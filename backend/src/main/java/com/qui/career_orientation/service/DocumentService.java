package com.qui.career_orientation.service;

import com.qui.career_orientation.entity.Document;
import com.qui.career_orientation.entity.dto.respond.DocumentResponse;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    Document uploadDocument(String title, String description, MultipartFile file, Long userId);

    List<DocumentResponse> getAllDocuments();

    List<DocumentResponse> searchDocuments(String keyword);

    void deleteDocument(Long id);

    DocumentResponse getDocumentById(Long id);

    DocumentResponse updateDocument(Long id, String title, String description, MultipartFile file, Long userId);

}