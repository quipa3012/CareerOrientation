package com.qui.career_orientation.service;

import java.util.List;

import com.qui.career_orientation.entity.Announcement;

public interface AnnouncementService {

    Announcement createAnnouncement(Announcement announcement);

    Announcement updateAnnouncement(Long id, Announcement updatedAnnouncement);

    void deleteAnnouncement(Long id);

    Announcement getAnnouncementById(Long id);

    List<Announcement> getAnnouncementsByClassId(Long classId);
}