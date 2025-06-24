package com.qui.career_orientation.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.qui.career_orientation.service.RoleService;
import com.qui.career_orientation.service.UserService;

@Configuration
public class AppInitConfig {
    @Bean
    ApplicationRunner applicationRunner(UserService userService, RoleService roleService) {
        return args -> {
            roleService.createDefaultRoles();
            userService.createAdminAccountIfNotExists();
            userService.createTestUserAccountIfNotExists();
        };
    }
}
