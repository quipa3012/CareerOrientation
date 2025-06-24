package com.qui.career_orientation.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.dto.request.AuthRequest;
import com.qui.career_orientation.entity.dto.request.IntrospectRequest;
import com.qui.career_orientation.entity.dto.respond.ApiRespond;
import com.qui.career_orientation.entity.dto.respond.AuthRespond;
import com.qui.career_orientation.entity.dto.respond.IntrospectRespond;
import com.qui.career_orientation.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ApiRespond<AuthRespond> login(@RequestBody AuthRequest request) {
        var login_result = authService.login(request);
        return ApiRespond.<AuthRespond>builder()
                .data(login_result)
                .build();
    }

    @PostMapping("/introspect")
    public ApiRespond<IntrospectRespond> introspect(@RequestBody IntrospectRequest request) {
        var result = authService.introspect(request);
        return ApiRespond.<IntrospectRespond>builder()
                .data(result)
                .build();
    }

}
