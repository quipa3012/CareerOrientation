package com.qui.career_orientation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ApiEndpointConfig {

    @Bean
    public PublicApi publicApi() {
        return new PublicApi(List.of(
                "/api/auth/**",
                "/api/questions/**"));
    }

    @Bean
    public ProtectedApi protectedApi() {
        return new ProtectedApi(List.of(
                "/api/admin"));
    }

    public record PublicApi(List<String> endpoints) {
    }

    public record ProtectedApi(List<String> endpoints) {
    }
}
