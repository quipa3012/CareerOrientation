package com.qui.career_orientation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qui.career_orientation.entity.Announcement;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.AnnouncementRepository;
import com.qui.career_orientation.service.AnnouncementService;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    @Override
    public Announcement createAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    @Override
    public Announcement updateAnnouncement(Long id, Announcement updated) {
        Announcement existing = announcementRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ANNOUNCEMENT_NOT_FOUND));

        existing.setTitle(updated.getTitle());
        existing.setContent(updated.getContent());

        return announcementRepository.save(existing);
    }

    @Override
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new AppException(ErrorCode.ANNOUNCEMENT_NOT_FOUND);
        }
        announcementRepository.deleteById(id);
    }

    @Override
    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ANNOUNCEMENT_NOT_FOUND));
    }

    @Override
    public List<Announcement> getAnnouncementsByClassId(Long classId) {
        return announcementRepository.findByClazzIdOrderByCreatedAtDesc(classId);
    }
}