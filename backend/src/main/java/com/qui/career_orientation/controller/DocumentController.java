package com.qui.career_orientation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.qui.career_orientation.entity.Document;
import com.qui.career_orientation.entity.dto.respond.DocumentResponse;
import com.qui.career_orientation.service.DocumentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Slf4j
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping
    public ResponseEntity<Document> uploadDocument(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam MultipartFile file,
            @RequestParam Long userId) {
        log.info("Request to upload document: title={}, userId={}", title, userId);
        Document document = documentService.uploadDocument(title, description, file, userId);
        return ResponseEntity.ok(document);
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @GetMapping("/search")
    public ResponseEntity<List<DocumentResponse>> searchDocuments(@RequestParam String keyword) {
        return ResponseEntity.ok(documentService.searchDocuments(keyword));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PutMapping("/{id}")
    public DocumentResponse updateDocument(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam Long userId) {
        return documentService.updateDocument(id, title, description, file, userId);
    }

}