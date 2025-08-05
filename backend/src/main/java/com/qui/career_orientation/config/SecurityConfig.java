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
import com.qui.career_orientation.config.ApiEndpointConfig.ProtectedApi;
import com.qui.career_orientation.config.ApiEndpointConfig.PublicApi;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final ProtectedApi protectedApi;
        private final CorsConfigurationSource corsConfigurationSource;
        private final CustomJwtDecoder customJwtDecoder;
        private final JwtAuthenticationConverter jwtAuthenticationConverter;
        private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
        private final PublicApi publicApi;

        SecurityConfig(JwtAuthenticationConverter jwtAuthenticationConverter,
                        JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint, CustomJwtDecoder customJwtDecoder,
                        CorsConfigurationSource corsConfigurationSource, PublicApi publicApi,
                        ApiEndpointConfig.ProtectedApi protectedApi) {
                this.jwtAuthenticationConverter = jwtAuthenticationConverter;
                this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
                this.customJwtDecoder = customJwtDecoder;
                this.corsConfigurationSource = corsConfigurationSource;
                this.publicApi = publicApi;
                this.protectedApi = protectedApi;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                                .csrf(csrf -> csrf.disable())
                                .headers(headers -> headers.frameOptions(
                                                frameOptions -> frameOptions.disable()))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(publicApi.endpoints()
                                                                .toArray(new String[0]))
                                                .permitAll()
                                                .requestMatchers(protectedApi.endpoints()
                                                                .toArray(new String[0]))
                                                .authenticated()
                                                .requestMatchers("/uploads/**").permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(
                                                customJwtDecoder)
                                                .jwtAuthenticationConverter(jwtAuthenticationConverter))
                                                .authenticationEntryPoint(jwtAuthenticationEntryPoint));

                return http.build();
        }
}