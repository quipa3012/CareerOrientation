package com.qui.career_orientation.controller;

import com.qui.career_orientation.entity.Announcement;
import com.qui.career_orientation.entity.Clazz;
import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.respond.AnnouncementResponse;
import com.qui.career_orientation.entity.mapper.AnnouncementMapper;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.service.AnnouncementService;
import com.qui.career_orientation.service.ClazzService;
import com.qui.career_orientation.service.UserService;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final UserService userService;
    private final ClazzService clazzService;
    private final AnnouncementMapper announcementMapper;

    @PostMapping
    public ResponseEntity<AnnouncementResponse> createAnnouncement(
            @RequestParam Long clazzId,
            @RequestBody Announcement request,
            Principal principal) {

        User currentUser = userService.getUserByUserName(principal.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Clazz clazz = clazzService.getClazzEntityById(clazzId);

        if (!clazz.getTeacher().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        request.setClazz(clazz);
        request.setCreatedBy(currentUser);
        request.setCreatedAt(LocalDateTime.now());

        Announcement saved = announcementService.createAnnouncement(request);
        return ResponseEntity.ok(announcementMapper.toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementResponse> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Announcement updateRequest,
            Principal principal) {

        User currentUser = userService.getUserByUserName(principal.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Announcement existing = announcementService.getAnnouncementById(id);

        if (!existing.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        Announcement updated = announcementService.updateAnnouncement(id, updateRequest);
        return ResponseEntity.ok(announcementMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(
            @PathVariable Long id,
            Principal principal) {

        User currentUser = userService.getUserByUserName(principal.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Announcement existing = announcementService.getAnnouncementById(id);

        if (!existing.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncementsByClass(@PathVariable Long classId) {
        List<Announcement> announcements = announcementService.getAnnouncementsByClassId(classId);
        return ResponseEntity.ok(announcementMapper.toResponseList(announcements));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementResponse> getAnnouncement(@PathVariable Long id) {
        Announcement announcement = announcementService.getAnnouncementById(id);
        return ResponseEntity.ok(announcementMapper.toResponse(announcement));
    }
}
