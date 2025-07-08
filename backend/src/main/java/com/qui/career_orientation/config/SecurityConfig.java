package com.qui.career_orientation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final CustomJwtDecoder customJwtDecoder;
    private final JwtAuthenticationConverter jwtAuthenticationConverter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    SecurityConfig(JwtAuthenticationConverter jwtAuthenticationConverter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint, CustomJwtDecoder customJwtDecoder,
            CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthenticationConverter = jwtAuthenticationConverter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.customJwtDecoder = customJwtDecoder;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(
                        frameOptions -> frameOptions.disable()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        // .requestMatchers(HttpMethod.GET,
                        // "/api/users").hasAnyRole(RoleConstant.ADMIN.name())
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(
                        customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter))
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint));

        return http.build();
    }
}