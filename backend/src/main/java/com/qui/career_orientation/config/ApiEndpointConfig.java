package com.qui.career_orientation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ApiEndpointConfig {

    @Bean
    public PublicApi publicApi() {
        return new PublicApi(List.of(
                "/api/users", // Create user
                "/api/auth/**", // Auth APIs
                "/api/public/**", // Public APIs
                "/uploads/**", // Static files (avatars, etc.)
                "/swagger-ui/**", // Swagger UI
                "/v3/api-docs/**" // OpenAPI docs
        ));
    }

    @Bean
    public ProtectedApi protectedApi() {
        return new ProtectedApi(List.of(
                "/api/users", // User management
                "/api/admin/**"));
    }

    public record PublicApi(List<String> endpoints) {
    }

    public record ProtectedApi(List<String> endpoints) {
    }
}
