package com.qui.career_orientation.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.qui.career_orientation.entity.Document;
import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.respond.DocumentResponse;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.DocumentRepository;
import com.qui.career_orientation.repository.UserRepository;
import com.qui.career_orientation.service.DocumentService;
import com.qui.career_orientation.service.StorageService;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Override
    public Document uploadDocument(String title, String description, MultipartFile file, Long userId) {
        log.info("Uploading document: title={}, uploadedBy={}", title, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String fileUrl = storageService.storeDocumentFile(title, file);

        Document document = Document.builder()
                .title(title)
                .description(description)
                .fileUrl(fileUrl)
                .updatedAt(LocalDateTime.now())
                .updatedBy(user)
                .build();

        return documentRepository.save(document);
    }

    @Override
    public List<DocumentResponse> getAllDocuments() {
        return documentRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<DocumentResponse> searchDocuments(String keyword) {
        return documentRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new AppException(ErrorCode.DOCUMENT_NOT_FOUND);
        }
        documentRepository.deleteById(id);
    }

    @Override
    public DocumentResponse getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));
        return DocumentResponse.builder()
                .id(document.getId())
                .title(document.getTitle())
                .description(document.getDescription())
                .fileUrl(document.getFileUrl())
                .updatedAt(document.getUpdatedAt())
                .updatedBy(document.getUpdatedBy() != null ? document.getUpdatedBy().getFullName() : null)
                .build();
    }

    @Override
    public DocumentResponse updateDocument(Long id, String title, String description, MultipartFile file, Long userId) {
        log.info("Updating document id={} by userId={}", id, userId);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        document.setTitle(title);
        document.setDescription(description);

        if (file != null && !file.isEmpty()) {
            String fileUrl = storageService.storeDocumentFile(title, file);
            document.setFileUrl(fileUrl);
        }

        document.setUpdatedAt(LocalDateTime.now());
        document.setUpdatedBy(user);

        Document saved = documentRepository.save(document);
        return mapToDto(saved);
    }

    private DocumentResponse mapToDto(Document doc) {
        return DocumentResponse.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .description(doc.getDescription())
                .fileUrl(doc.getFileUrl())
                .updatedAt(doc.getUpdatedAt())
                .updatedBy(doc.getUpdatedBy().getFullName())
                .build();
    }
}