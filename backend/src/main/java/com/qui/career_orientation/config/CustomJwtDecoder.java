package com.qui.career_orientation.config;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidationException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.qui.career_orientation.entity.dto.request.IntrospectRequest;
import com.qui.career_orientation.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class CustomJwtDecoder implements JwtDecoder {

    private final AuthService authService;
    private final String secretKey;
    private final HttpServletRequest request;
    private NimbusJwtDecoder nimbusJwtDecoder = null;

    public CustomJwtDecoder(AuthService authService,
            @Value("${jwt.secret-key}") String secretKey,
            HttpServletRequest request) {
        this.authService = authService;
        this.secretKey = secretKey;
        this.request = request;
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        var response = authService.introspect(
                IntrospectRequest.builder().token(token).build());

        if (!response.isValid()) {
            request.setAttribute("exception", "token_invalid");
            throw new JwtException("Token invalid");
        }

        if (nimbusJwtDecoder == null) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA512");
            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        try {
            return nimbusJwtDecoder.decode(token);
        } catch (JwtValidationException ex) {
            boolean isExpired = ex.getErrors().stream()
                    .anyMatch(err -> err.getErrorCode().equals("invalid_token") &&
                            err.getDescription().contains("expired"));

            if (isExpired) {
                request.setAttribute("exception", "token_expired");
            } else {
                request.setAttribute("exception", "token_invalid");
            }
            throw ex;
        }
    }
}
