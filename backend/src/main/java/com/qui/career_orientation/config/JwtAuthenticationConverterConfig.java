package com.qui.career_orientation.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

@Configuration
public class JwtAuthenticationConverterConfig {

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(this::extractAuthorities);
        return converter;
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        // 1. Lấy authorities từ claim "scope" (nếu có)
        JwtGrantedAuthoritiesConverter defaultConverter = new JwtGrantedAuthoritiesConverter();
        defaultConverter.setAuthorityPrefix("ROLE_"); // biến scope -> ROLE_ADMIN

        Collection<GrantedAuthority> authorities = new ArrayList<>(defaultConverter.convert(jwt));

        // 2. Lấy thêm authorities từ claim "permissions"
        List<String> permissions = jwt.getClaimAsStringList("permissions");
        if (permissions != null) {
            List<GrantedAuthority> permissionAuthorities = permissions.stream()
                    .map(SimpleGrantedAuthority::new) // giữ nguyên như "READ_USER"
                    .collect(Collectors.toList());
            authorities.addAll(permissionAuthorities);
        }

        return authorities;
    }
}