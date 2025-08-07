package com.qui.career_orientation.entity.mapper;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.qui.career_orientation.entity.Announcement;
import com.qui.career_orientation.entity.dto.respond.AnnouncementResponse;
import com.qui.career_orientation.entity.dto.respond.UserResponse;

@Component
public class AnnouncementMapper {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public AnnouncementResponse toResponse(Announcement announcement) {
        if (announcement == null)
            return null;

        return AnnouncementResponse.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .createdAt(announcement.getCreatedAt().format(formatter))
                .createdBy(toUserResponse(announcement.getCreatedBy()))
                .build();
    }

    public List<AnnouncementResponse> toResponseList(List<Announcement> announcements) {
        return announcements.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private UserResponse toUserResponse(com.qui.career_orientation.entity.User user) {
        if (user == null)
            return null;

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}