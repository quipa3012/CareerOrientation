package com.qui.career_orientation.service;

import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.request.AuthRequest;
import com.qui.career_orientation.entity.dto.request.IntrospectRequest;
import com.qui.career_orientation.entity.dto.respond.AuthRespond;
import com.qui.career_orientation.entity.dto.respond.IntrospectRespond;

public interface AuthService {
    AuthRespond login(AuthRequest request);

    String generateToken(User user);

    IntrospectRespond introspect(IntrospectRequest token);
}
