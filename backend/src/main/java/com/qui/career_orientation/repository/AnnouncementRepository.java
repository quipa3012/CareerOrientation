package com.qui.career_orientation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qui.career_orientation.entity.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByClazzIdOrderByCreatedAtDesc(Long clazzId);
}