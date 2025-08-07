package com.qui.career_orientation.entity.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.qui.career_orientation.entity.Announcement;
import com.qui.career_orientation.entity.Clazz;
import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.request.ClazzRequest;
import com.qui.career_orientation.entity.dto.respond.AnnouncementResponse;
import com.qui.career_orientation.entity.dto.respond.ClazzResponse;
import com.qui.career_orientation.entity.dto.respond.UserResponse;

@Component
public class ClazzMapper {

    // mapping từ entity sang response
    public ClazzResponse toClazzResponse(Clazz clazz) {
        return ClazzResponse.builder()
                .id(clazz.getId())
                .name(clazz.getName())
                .password(clazz.getPassword())
                .teacher(toUserResponse(clazz.getTeacher()))
                .announcements(toAnnouncementResponseList(clazz.getAnnouncements()))
                .build();
    }

    public ClazzResponse toResponse(Clazz clazz) {
        return toClazzResponse(clazz);
    }

    // mapping từ request sang entity
    public Clazz toEntity(ClazzRequest request, User teacher) {
        if (request == null)
            return null;
        return Clazz.builder()
                .name(request.getName())
                .password(request.getPassword())
                .teacher(teacher)
                .build();
    }

    public List<ClazzResponse> toClazzResponseList(List<Clazz> clazzList) {
        return clazzList.stream()
                .map(this::toClazzResponse)
                .collect(Collectors.toList());
    }

    private UserResponse toUserResponse(User user) {
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

    private AnnouncementResponse toAnnouncementResponse(Announcement announcement) {
        if (announcement == null)
            return null;
        return AnnouncementResponse.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .createdAt(announcement.getCreatedAt().toString())
                .createdBy(toUserResponse(announcement.getCreatedBy()))
                .build();
    }

    private List<AnnouncementResponse> toAnnouncementResponseList(List<Announcement> announcements) {
        if (announcements == null)
            return List.of();
        return announcements.stream()
                .map(this::toAnnouncementResponse)
                .collect(Collectors.toList());
    }
}
