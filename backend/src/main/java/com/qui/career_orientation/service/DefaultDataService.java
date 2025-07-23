package com.qui.career_orientation.service;

public interface DefaultDataService {

    void createDefaultRoles();

    void createAdminAccountIfNotExists();

    void createTestUserAccountIfNotExists();

    void createDefaultPermissions();

    void createDefaultPermissionRole();

    void createDefaultBlocks();

    void createDefaultMajors();

    void createDefaultQuestions();

    void init();
}