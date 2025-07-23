package com.qui.career_orientation.service.impl;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.qui.career_orientation.entity.InvalidatedToken;
import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.entity.dto.request.AuthRequest;
import com.qui.career_orientation.entity.dto.request.IntrospectRequest;
import com.qui.career_orientation.entity.dto.request.LogoutRequest;
import com.qui.career_orientation.entity.dto.respond.AuthRespond;
import com.qui.career_orientation.entity.dto.respond.IntrospectRespond;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.InvalidatedTokenRepository;
import com.qui.career_orientation.service.AuthService;
import com.qui.career_orientation.service.UserService;
import com.qui.career_orientation.util.CookieUtil;
import com.qui.career_orientation.util.PermissionUtil;
import com.qui.career_orientation.util.constant.ErrorCode;

import jakarta.servlet.http.HttpServletResponse;
import lombok.experimental.NonFinal;

@Service
public class AuthServiceImpl implements AuthService {

    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserService userService, PasswordEncoder passwordEncoder,
            InvalidatedTokenRepository invalidatedTokenRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.invalidatedTokenRepository = invalidatedTokenRepository;
    }

    @NonFinal
    @Value("${jwt.secret-key}")
    protected String SECRET_KEY;
    private static final int REFRESH_TOKEN_EXPIRATION_SECONDS = 7 * 24 * 60 * 60;

    @Override
    public IntrospectRespond introspect(IntrospectRequest request) {
        var token = request.getToken();
        boolean invalid = true;
        try {
            verifyToken(token);
        } catch (AppException e) {
            invalid = false;
        }
        return IntrospectRespond.builder()
                .valid(invalid)
                .build();

    }

    @Override
    public AuthRespond login(AuthRequest request, HttpServletResponse response) {

        var user = userService.getUserByUserName(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!Boolean.TRUE.equals(user.getPasswordChanged())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_CHANGED);
        }

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }

        String accessToken = generateToken(user);
        String refreshToken = generateRefreshToken(user);

        CookieUtil.addRefreshTokenCookie(response, refreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS);

        String role = user.getRole().getName();

        return AuthRespond.builder()
                .accesstoken(
                        accessToken)
                .authenticated(authenticated)
                .role(role)
                .build();
    }

    @Override
    public String generateToken(User user) {
        List<String> permissions = PermissionUtil.extractPermissionNamesFromUser(user);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("qui-career-orientation")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(15, ChronoUnit.MINUTES).toEpochMilli()))
                .claim("scope", user.getRole().getName())
                .claim("permissions", permissions)
                .jwtID(UUID.randomUUID().toString())
                .claim("token_type", "access")
                .build();

        return signToken(jwtClaimsSet);
    }

    private String generateRefreshToken(User user) {
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("qui-career-orientation")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(7, ChronoUnit.DAYS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("token_type", "refresh")
                .build();

        return signToken(jwtClaimsSet);
    }

    private SignedJWT verifyToken(String token) {
        try {
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

            SignedJWT signedJWT = SignedJWT.parse(token);

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            var verified = signedJWT.verify(verifier);

            if (!(verified && expirationTime.after(
                    new Date()))) {
                throw new AppException(ErrorCode.JWT_EXPIRED);
            }

            if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            ;

            return signedJWT;

        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

    @Override
    public void logout(LogoutRequest token, HttpServletResponse response) {
        var signToken = verifyToken(token.getToken());

        try {

            String jwi = signToken.getJWTClaimsSet().getJWTID();
            Date expirationTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jwi)
                    .expirationTime(expirationTime)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);

            CookieUtil.clearRefreshTokenCookie(response);

        } catch (ParseException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

    private String signToken(JWTClaimsSet jwtClaimsSet) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new AppException(ErrorCode.CAN_NOT_SIGN_JWT);
        }
    }

    @Override
    public AuthRespond refresh(String refreshToken, HttpServletResponse response) {
        var signedJWT = verifyToken(refreshToken);

        assertTokenType(signedJWT, "refresh");

        String username;
        try {
            username = signedJWT.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        var user = userService.getUserByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = generateToken(user);
        String newRefreshToken = generateRefreshToken(user);

        CookieUtil.addRefreshTokenCookie(response, newRefreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS);

        String role = user.getRole().getName();

        return AuthRespond.builder()
                .accesstoken(newAccessToken)
                .authenticated(true)
                .role(role)
                .build();
    }

    private void assertTokenType(SignedJWT signedJWT, String expectedType) {
        try {
            String tokenType = signedJWT.getJWTClaimsSet().getStringClaim("token_type");
            if (!expectedType.equals(tokenType)) {
                throw new AppException(ErrorCode.JWT_INVALID);
            }
        } catch (ParseException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

}