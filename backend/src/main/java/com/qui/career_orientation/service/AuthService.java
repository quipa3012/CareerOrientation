package com.qui.career_orientation.service;

import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.request.AuthRequest;
import com.qui.career_orientation.entity.dto.request.IntrospectRequest;
import com.qui.career_orientation.entity.dto.request.LogoutRequest;
import com.qui.career_orientation.entity.dto.respond.AuthRespond;
import com.qui.career_orientation.entity.dto.respond.IntrospectRespond;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    AuthRespond login(AuthRequest request, HttpServletResponse response);

    String generateToken(User user);

    IntrospectRespond introspect(IntrospectRequest token);

    void logout(LogoutRequest token, HttpServletResponse response);

    AuthRespond refresh(String refreshToken, HttpServletResponse response);
}
