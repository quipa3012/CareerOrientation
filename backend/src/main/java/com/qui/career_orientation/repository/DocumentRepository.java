package com.qui.career_orientation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qui.career_orientation.entity.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByTitleContainingIgnoreCase(String keyword);

}