package com.qui.career_orientation.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qui.career_orientation.entity.dto.request.AuthRequest;
import com.qui.career_orientation.entity.dto.request.IntrospectRequest;
import com.qui.career_orientation.entity.dto.request.LogoutRequest;
import com.qui.career_orientation.entity.dto.respond.ApiRespond;
import com.qui.career_orientation.entity.dto.respond.AuthRespond;
import com.qui.career_orientation.entity.dto.respond.IntrospectRespond;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.service.AuthService;
import com.qui.career_orientation.util.CookieUtil;
import com.qui.career_orientation.util.constant.ErrorCode;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ApiRespond<AuthRespond> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        var login_result = authService.login(request, response);
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

    @PostMapping("/logout")
    public ApiRespond<Void> logout(@RequestBody LogoutRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ApiRespond.<Void>builder()
                .build();
    }

    @PostMapping("/refresh-token")
    public ApiRespond<AuthRespond> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = CookieUtil.getRefreshTokenFromRequest(request);
        if (refreshToken == null) {
            throw new AppException(ErrorCode.COOKIE_NOT_FOUND);
        }

        var result = authService.refresh(refreshToken, response);
        String newAccessToken = result.getAccesstoken();
        String role = result.getRole();

        return ApiRespond.<AuthRespond>builder()
                .data(AuthRespond.builder()
                        .accesstoken(newAccessToken)
                        .authenticated(true)
                        .role(role)
                        .build())
                .build();
    }

}
