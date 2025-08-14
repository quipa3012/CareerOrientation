package com.qui.career_orientation.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qui.career_orientation.entity.Block;
import com.qui.career_orientation.entity.Major;
import com.qui.career_orientation.entity.Permission;
import com.qui.career_orientation.entity.PermissionRole;
import com.qui.career_orientation.entity.Question;
import com.qui.career_orientation.entity.Role;
import com.qui.career_orientation.entity.TestResult;
import com.qui.career_orientation.entity.User;
import com.qui.career_orientation.exception.AppException;
import com.qui.career_orientation.repository.*;
import com.qui.career_orientation.service.DefaultDataService;
import com.qui.career_orientation.util.constant.ErrorCode;
import com.qui.career_orientation.util.constant.RoleConstant;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultDataServiceImpl implements DefaultDataService {

        private final RoleRepository roleRepository;
        private final UserRepository userRepository;
        private final PermissionRepository permissionRepository;
        private final PermissionRoleRepository permissionRoleRepository;
        private final PasswordEncoder passwordEncoder;
        private final BlockRepository blockRepository;
        private final MajorRepository majorRepository;
        private final QuestionRepository questionRepository;
        private final TestResultRepository testResultRepository;

        /** ==================== PERMISSION ==================== */
        private static final List<Permission> DEFAULT_PERMISSIONS = List.of(
                        Permission.builder()
                                        .name("SYSTEM_ADMIN")
                                        .description("System administrator with all permissions")
                                        .build(),
                        Permission.builder()
                                        .name("ROLE_PERMISSION_MANAGE")
                                        .description("Manage roles and permissions")
                                        .build(),
                        Permission.builder()
                                        .name("USER_READ")
                                        .description("Read user information")
                                        .build(),
                        Permission.builder()
                                        .name("USER_WRITE")
                                        .description("Modify user information")
                                        .build(),
                        Permission.builder()
                                        .name("USER_MYPROFILE_WRITE")
                                        .description("Access and modify own profile")
                                        .build(),
                        Permission.builder()
                                        .name("ROLE_MANAGE")
                                        .description("Manage roles and permissions")
                                        .build(),
                        Permission.builder()
                                        .name("PROVINCE_MANAGE")
                                        .build()

        );

        private void createPermissionIfNotExists(Permission permission) {
                if (!permissionRepository.existsById(permission.getName())) {
                        permissionRepository.save(permission);
                        log.info("Created default permission: {}", permission.getName());
                }
        }

        @Override
        public void createDefaultPermissions() {
                DEFAULT_PERMISSIONS.forEach(this::createPermissionIfNotExists);
        }

        /** ==================== ROLE ==================== */
        private void createRoleIfNotExists(String roleName) {
                if (!roleRepository.existsById(roleName)) {
                        Role role = Role.builder()
                                        .name(roleName)
                                        .permissionRoles(List.of()) // mặc định rỗng
                                        .build();
                        roleRepository.save(role);
                        log.info("Created default role: {}", roleName);
                }
        }

        public void createDefaultRoles() {
                createRoleIfNotExists(RoleConstant.ADMIN.name());
                createRoleIfNotExists(RoleConstant.TEACHER.name());
                createRoleIfNotExists(RoleConstant.STUDENT.name());
        }

        /** ==================== PERMISSION ROLE ==================== */

        private static final Map<String, List<String>> ROLE_PERMISSIONS = Map.of(
                        "ADMIN", List.of("SYSTEM_ADMIN", "ROLE_PERMISSION_MANAGE", "USER_READ", "USER_WRITE"),
                        "TEACHER", List.of("USER_READ", "USER_WRITE"),
                        "STUDENT", List.of("USER_READ", "USER_MYPROFILE_WRITE"));

        private void assignPermissionToRole(String roleName, String permissionName) {
                Role role = roleRepository.findById(roleName)
                                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

                Permission permission = permissionRepository.findById(permissionName)
                                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));

                // Fix: truyền đúng roleName và permissionName vào repo
                boolean exists = permissionRoleRepository.existsByRole_NameAndPermission_Name(
                                role.getName(),
                                permission.getName());

                if (!exists) {
                        PermissionRole permissionRole = PermissionRole.builder()
                                        .role(role)
                                        .permission(permission)
                                        .build();
                        permissionRoleRepository.save(permissionRole);
                        log.info("Assigned permission '{}' to role '{}'", permissionName, roleName);
                }
        }

        @Override
        public void createDefaultPermissionRole() {
                ROLE_PERMISSIONS.forEach((roleName, permissions) -> {
                        permissions.forEach(permissionName -> {
                                assignPermissionToRole(roleName, permissionName);
                        });
                });
        }

        /** ==================== USER ==================== */
        private void createDefaultAccountIfNotExists(String username, String fullName, String email,
                        String rawPassword, String roleName, String logMessage) {
                if (!userRepository.existsByUsername(username)) {
                        Role role = getRoleOrThrow(roleName);

                        User user = User.builder()
                                        .username(username)
                                        .fullName(fullName)
                                        .email(email)
                                        .password(passwordEncoder.encode(rawPassword))
                                        .role(role)
                                        .passwordChanged(true)
                                        .build();

                        userRepository.save(user);
                        log.warn(logMessage);
                }
        }

        public void createAdminAccountIfNotExists() {
                createDefaultAccountIfNotExists(
                                "admin",
                                "Administrator",
                                "admin@gmail.com",
                                "admin",
                                RoleConstant.ADMIN.name(),
                                "Admin account created with username 'admin' and password 'admin'. Please change it immediately after login.");
        }

        public void createTestTeacherAccountIfNotExists() {
                createDefaultAccountIfNotExists(
                                "teacher",
                                "Test Teacher",
                                "teacher@gmail.com",
                                "teacher",
                                RoleConstant.TEACHER.name(),
                                "Test Teacher account created with username 'teacher' and password 'teacher'. Please change it immediately after login.");
        }

        /**
         * Tạo mặc định 10 tài khoản học sinh student1 ~ student10
         */
        public void createDefaultStudentsIfNotExists() {
                for (int i = 1; i <= 10; i++) {
                        String username = "student" + i;
                        String fullName = "Student " + i;
                        String email = "student" + i + "@gmail.com";
                        String password = "student";
                        String logMessage = "Student account created with username '" + username + "' and password '"
                                        + password +
                                        "'. Please change it immediately after login.";

                        createDefaultAccountIfNotExists(username, fullName, email, password,
                                        RoleConstant.STUDENT.name(), logMessage);
                }
        }

        /** BLOCKS */

        private static final List<Block> DEFAULT_BLOCKS = List.of(
                        Block.builder()
                                        .code("KHTN")
                                        .name("Khối Khoa Học Tự Nhiên")
                                        .modelLabel(0)
                                        .build(),
                        Block.builder()
                                        .code("KHXH")
                                        .name("Khối Khoa Học Xã Hội")
                                        .modelLabel(11)
                                        .build());

        private void createBlockIfNotExists(Block block) {
                boolean exists = blockRepository.existsByCode(block.getCode());
                if (!exists) {
                        blockRepository.save(block);
                        log.info("✅ Created default block: {}", block.getCode());
                }
        }

        @Override
        public void createDefaultBlocks() {
                DEFAULT_BLOCKS.forEach(this::createBlockIfNotExists);
        }

        /** ==================== MAJORS ==================== */
        private void createMajorIfNotExists(String code, String name, String description, String blockCode) {
                boolean exists = majorRepository.existsByCode(code);
                if (!exists) {
                        Block block = blockRepository.findByCode(blockCode)
                                        .orElseThrow(() -> new AppException(ErrorCode.BLOCK_NOT_FOUND));

                        Major major = Major.builder()
                                        .code(code)
                                        .name(name)
                                        .description(description)
                                        .block(block)
                                        .build();

                        majorRepository.save(major);
                        log.info("✅ Created default major: {} ({})", name, blockCode);
                }
        }

        @Override
        public void createDefaultMajors() {
                // Nhóm ngành Công Nghệ Thông Tin
                createMajorIfNotExists(
                                "CNTT",
                                "Nhóm ngành Công Nghệ Thông Tin",
                                "Nhóm ngành Công Nghệ Thông Tin bao gồm các lĩnh vực như lập trình, phát triển phần mềm, kỹ thuật phần mềm, "
                                                +
                                                "cơ sở dữ liệu, trí tuệ nhân tạo, dữ liệu lớn, mạng máy tính và an ninh mạng. Sinh viên học ngành này sẽ được đào tạo "
                                                +
                                                "từ lý thuyết cơ bản đến ứng dụng thực tiễn, phát triển tư duy logic, kỹ năng giải quyết vấn đề, sáng tạo trong nghiên cứu "
                                                +
                                                "và ứng dụng công nghệ hiện đại, đáp ứng nhu cầu ngành CNTT trong kỷ nguyên số.",
                                "KHTN");

                // Nhóm ngành Điện – Điện tử – Viễn thông
                createMajorIfNotExists(
                                "DIENTU",
                                "Nhóm ngành Điện – Điện tử – Viễn Thông",
                                "Nhóm ngành này bao gồm các lĩnh vực kỹ thuật điện, điện tử, viễn thông, tự động hóa, robot, "
                                                +
                                                "và hệ thống nhúng. Sinh viên sẽ học về thiết kế, vận hành, bảo trì và tối ưu hóa các hệ thống điện tử "
                                                +
                                                "và truyền thông, đồng thời phát triển kỹ năng nghiên cứu, phân tích, giải quyết vấn đề, áp dụng công nghệ hiện đại "
                                                +
                                                "vào các ngành công nghiệp và viễn thông.",
                                "KHTN");

                // Nhóm ngành Cơ khí – Tự động hóa
                createMajorIfNotExists(
                                "COMEKI",
                                "Nhóm ngành Cơ Khí – Tự Động Hóa",
                                "Nhóm ngành này tập trung vào cơ khí, chế tạo máy, cơ điện tử, tự động hóa và robot. " +
                                                "Sinh viên được đào tạo về thiết kế, vận hành, bảo trì, cải tiến và tối ưu hóa hệ thống máy móc công nghiệp, "
                                                +
                                                "kỹ năng phân tích kỹ thuật, tư duy logic và sáng tạo, đáp ứng nhu cầu phát triển công nghiệp 4.0.",
                                "KHTN");

                // Nhóm ngành Y Dược – Sức khỏe
                createMajorIfNotExists(
                                "YDUOC",
                                "Nhóm ngành Y Dược – Sức Khỏe",
                                "Nhóm ngành Y Dược bao gồm y học, dược học, điều dưỡng, y tế cộng đồng, nha khoa và các ngành liên quan. "
                                                +
                                                "Sinh viên sẽ học cách chăm sóc sức khỏe, chẩn đoán và điều trị bệnh, nghiên cứu khoa học y học, "
                                                +
                                                "áp dụng công nghệ y sinh, phát triển kỹ năng giao tiếp, quản lý và tư duy phản biện trong môi trường y tế hiện đại.",
                                "KHTN");

                // Nhóm ngành Kinh tế – Quản lý
                createMajorIfNotExists(
                                "KINHDOANH",
                                "Nhóm ngành Kinh Tế – Quản Lý",
                                "Nhóm ngành Kinh Tế – Quản Lý bao gồm quản trị kinh doanh, tài chính – ngân hàng, kế toán, marketing, logistics, quản lý nhân sự và các ngành liên quan. "
                                                +
                                                "Sinh viên được đào tạo kiến thức về quản lý doanh nghiệp, phân tích thị trường, lập kế hoạch chiến lược, kỹ năng lãnh đạo, giao tiếp và ra quyết định trong môi trường kinh tế toàn cầu.",
                                "KHXH");

                // Nhóm ngành Luật – Chính trị – Quan hệ quốc tế
                createMajorIfNotExists(
                                "LUAT",
                                "Nhóm ngành Luật – Chính trị – Quan Hệ Quốc Tế",
                                "Nhóm ngành này bao gồm luật, chính trị học, quan hệ quốc tế, ngoại giao, và các ngành xã hội liên quan. "
                                                +
                                                "Sinh viên sẽ học cách nghiên cứu pháp luật, phân tích chính sách, quản lý xã hội, giao tiếp, đàm phán, "
                                                +
                                                "tư duy phản biện và giải quyết các vấn đề phức tạp trong bối cảnh trong nước và quốc tế.",
                                "KHXH");

                // Nhóm ngành Giáo dục – Tâm lý – Xã hội
                createMajorIfNotExists(
                                "GD_TAMLY",
                                "Nhóm ngành Giáo Dục – Tâm Lý – Xã Hội",
                                "Nhóm ngành này bao gồm giáo dục học, tâm lý học, xã hội học, sư phạm, và các lĩnh vực nghiên cứu con người. "
                                                +
                                                "Sinh viên sẽ học cách giảng dạy, nghiên cứu hành vi, phát triển con người, xây dựng chương trình giáo dục, "
                                                +
                                                "tư vấn tâm lý và giải quyết các vấn đề xã hội, phát triển kỹ năng giao tiếp, lãnh đạo và quản lý trong môi trường xã hội đa dạng.",
                                "KHXH");

                // Nhóm ngành Nghệ thuật – Truyền thông
                createMajorIfNotExists(
                                "NGHE_THUAT",
                                "Nhóm ngành Nghệ Thuật – Truyền Thông",
                                "Nhóm ngành này bao gồm mỹ thuật, thiết kế đồ họa, âm nhạc, điện ảnh, truyền thông, báo chí, quảng cáo và các ngành sáng tạo khác. "
                                                +
                                                "Sinh viên sẽ được đào tạo kỹ năng sáng tạo, tư duy thẩm mỹ, kỹ năng truyền thông, sản xuất nội dung, quản lý dự án sáng tạo và phát triển nghề nghiệp trong các lĩnh vực nghệ thuật và truyền thông.",
                                "KHXH");

                // Nhóm ngành Du lịch – Nhà hàng – Khách sạn
                createMajorIfNotExists(
                                "DL_NHKS",
                                "Nhóm ngành Du Lịch – Nhà Hàng – Khách Sạn",
                                "Nhóm ngành này bao gồm du lịch, quản lý khách sạn, quản lý nhà hàng, hướng dẫn du lịch và các dịch vụ liên quan. "
                                                +
                                                "Sinh viên sẽ được trang bị kiến thức về quản lý dịch vụ, kỹ năng giao tiếp, tổ chức sự kiện, marketing du lịch, "
                                                +
                                                "phát triển kỹ năng phục vụ khách hàng và khả năng sáng tạo trong việc xây dựng trải nghiệm du lịch và dịch vụ chất lượng cao.",
                                "KHXH");

                // Nhóm ngành Nông – Lâm – Ngư nghiệp
                createMajorIfNotExists(
                                "NONG_LAM_NGU",
                                "Nhóm ngành Nông – Lâm – Ngư nghiệp",
                                "Nhóm ngành này bao gồm nông học, lâm nghiệp, thủy sản, quản lý tài nguyên và môi trường. "
                                                +
                                                "Sinh viên sẽ học về sản xuất, bảo vệ và phát triển tài nguyên nông – lâm – ngư, nghiên cứu sinh thái, quản lý môi trường, "
                                                +
                                                "áp dụng khoa học kỹ thuật và công nghệ mới vào sản xuất bền vững, đồng thời phát triển kỹ năng nghiên cứu và giải quyết vấn đề thực tiễn.",
                                "KHTN");

                // Nhóm ngành Khoa học cơ bản – Toán – Vật lý – Hóa học
                createMajorIfNotExists(
                                "KHCB",
                                "Nhóm ngành Khoa Học Cơ Bản – Toán – Vật Lý – Hóa Học",
                                "Nhóm ngành này bao gồm toán học, vật lý, hóa học, thống kê, khoa học vật liệu và các ngành nghiên cứu cơ bản khác. "
                                                +
                                                "Sinh viên sẽ được trang bị kiến thức lý thuyết nền tảng, kỹ năng phân tích, nghiên cứu khoa học, tư duy logic, "
                                                +
                                                "giải quyết vấn đề và áp dụng kiến thức vào các ngành kỹ thuật, công nghệ và nghiên cứu ứng dụng.",
                                "KHTN");
        }

        /** ==================== QUESTIONS ==================== */
        private static final List<Question> DEFAULT_QUESTIONS = List.of(
                        // ====== RIASEC: Realistic (R) ======
                        Question.builder().code("R1").content("Tôi thích làm việc với máy móc, thiết bị khoa học")
                                        .category("RIASEC").build(),
                        Question.builder().code("R2").content("Tôi hứng thú với việc lắp ráp, sửa chữa đồ điện")
                                        .category("RIASEC").build(),
                        Question.builder().code("R3").content("Tôi yêu thích khám phá thiên nhiên và môi trường")
                                        .category("RIASEC").build(),
                        Question.builder().code("R4").content("Tôi muốn thử nghiệm vận hành các thiết bị kỹ thuật")
                                        .category("RIASEC").build(),
                        Question.builder().code("R5").content("Tôi thích tham gia thí nghiệm thực hành khoa học")
                                        .category("RIASEC").build(),
                        Question.builder().code("R6").content("Tôi hứng thú với việc chế tạo và thiết kế mô hình")
                                        .category("RIASEC").build(),
                        Question.builder().code("R7").content("Tôi thích tìm hiểu các nguyên lý vật lý, cơ học")
                                        .category("RIASEC").build(),
                        Question.builder().code("R8")
                                        .content("Tôi thấy hứng thú với các hoạt động nghiên cứu ngoài trời")
                                        .category("RIASEC").build(),

                        // ====== RIASEC: Investigative (I) ======
                        Question.builder().code("I1").content("Tôi thích nghiên cứu các vấn đề khoa học tự nhiên")
                                        .category("RIASEC").build(),
                        Question.builder().code("I2").content("Tôi yêu thích các môn Toán, Lý, Hóa, Sinh")
                                        .category("RIASEC").build(),
                        Question.builder().code("I3").content("Tôi tò mò về nguyên nhân và cách mọi thứ vận hành")
                                        .category("RIASEC").build(),
                        Question.builder().code("I4").content("Tôi muốn phân tích dữ liệu và tìm ra quy luật")
                                        .category("RIASEC").build(),
                        Question.builder().code("I5").content("Tôi thích đọc sách khoa học và khám phá kiến thức mới")
                                        .category("RIASEC").build(),
                        Question.builder().code("I6").content("Tôi quan tâm đến các thí nghiệm khoa học và nghiên cứu")
                                        .category("RIASEC").build(),
                        Question.builder().code("I7").content("Tôi hứng thú với việc giải quyết các bài toán phức tạp")
                                        .category("RIASEC").build(),
                        Question.builder().code("I8").content("Tôi thích lập luận logic và tư duy phản biện")
                                        .category("RIASEC").build(),

                        // ====== RIASEC: Artistic (A) ======
                        Question.builder().code("A1").content("Tôi thích vẽ, sáng tác nhạc hoặc thiết kế đồ họa")
                                        .category("RIASEC").build(),
                        Question.builder().code("A2").content("Tôi yêu thích tham gia các hoạt động nghệ thuật")
                                        .category("RIASEC").build(),
                        Question.builder().code("A3").content("Tôi muốn sáng tạo ra các ý tưởng độc đáo và mới lạ")
                                        .category("RIASEC").build(),
                        Question.builder().code("A4").content("Tôi thích viết truyện, làm thơ hoặc biên kịch")
                                        .category("RIASEC").build(),
                        Question.builder().code("A5").content("Tôi hứng thú với diễn xuất và trình diễn trên sân khấu")
                                        .category("RIASEC").build(),
                        Question.builder().code("A6").content("Tôi thích môi trường linh hoạt, không gò bó")
                                        .category("RIASEC").build(),
                        Question.builder().code("A7").content("Tôi quan tâm đến các tác phẩm mỹ thuật, văn học")
                                        .category("RIASEC").build(),
                        Question.builder().code("A8").content("Tôi thấy thú vị với thiết kế thời trang hoặc nội thất")
                                        .category("RIASEC").build(),

                        // ====== RIASEC: Social (S) ======
                        Question.builder().code("S1").content("Tôi thích giúp đỡ người khác học tập và phát triển")
                                        .category("RIASEC").build(),
                        Question.builder().code("S2").content("Tôi quan tâm đến các vấn đề xã hội và con người")
                                        .category("RIASEC").build(),
                        Question.builder().code("S3").content("Tôi thích làm việc nhóm, trao đổi và chia sẻ")
                                        .category("RIASEC").build(),
                        Question.builder().code("S4").content("Tôi muốn trở thành người truyền cảm hứng")
                                        .category("RIASEC").build(),
                        Question.builder().code("S5").content("Tôi yêu thích giảng dạy, đào tạo hoặc tư vấn")
                                        .category("RIASEC").build(),
                        Question.builder().code("S6").content("Tôi quan tâm đến các hoạt động cộng đồng, từ thiện")
                                        .category("RIASEC").build(),
                        Question.builder().code("S7").content("Tôi thích tìm hiểu về tâm lý, hành vi con người")
                                        .category("RIASEC").build(),
                        Question.builder().code("S8").content("Tôi hứng thú với việc tham gia các chương trình xã hội")
                                        .category("RIASEC").build(),

                        // ====== RIASEC: Enterprising (E) ======
                        Question.builder().code("E1").content("Tôi thích lãnh đạo, điều phối các hoạt động")
                                        .category("RIASEC").build(),
                        Question.builder().code("E2")
                                        .content("Tôi quan tâm đến các lĩnh vực kinh tế, luật và ngoại giao")
                                        .category("RIASEC").build(),
                        Question.builder().code("E3").content("Tôi thích đưa ra quyết định, chịu trách nhiệm")
                                        .category("RIASEC").build(),
                        Question.builder().code("E4").content("Tôi muốn xây dựng và quản lý dự án, sự kiện")
                                        .category("RIASEC").build(),
                        Question.builder().code("E5").content("Tôi hứng thú với đàm phán, thương lượng")
                                        .category("RIASEC").build(),
                        Question.builder().code("E6").content("Tôi yêu thích việc tổ chức các chương trình lớn")
                                        .category("RIASEC").build(),
                        Question.builder().code("E7").content("Tôi quan tâm đến tài chính, đầu tư và quản trị")
                                        .category("RIASEC").build(),
                        Question.builder().code("E8").content("Tôi hứng thú với việc khởi nghiệp, kinh doanh")
                                        .category("RIASEC").build(),

                        // ====== RIASEC: Conventional (C) ======
                        Question.builder().code("C1").content("Tôi thích sắp xếp, quản lý dữ liệu và hồ sơ")
                                        .category("RIASEC").build(),
                        Question.builder().code("C2").content("Tôi quan tâm đến công việc hành chính, quản lý")
                                        .category("RIASEC").build(),
                        Question.builder().code("C3").content("Tôi thích làm việc với con số, tính toán cẩn thận")
                                        .category("RIASEC").build(),
                        Question.builder().code("C4").content("Tôi yêu thích công việc có quy trình và nguyên tắc")
                                        .category("RIASEC").build(),
                        Question.builder().code("C5").content("Tôi hứng thú với việc quản lý ngân sách và kế hoạch")
                                        .category("RIASEC").build(),
                        Question.builder().code("C6").content("Tôi thích công việc ổn định, đều đặn, ít thay đổi")
                                        .category("RIASEC").build(),
                        Question.builder().code("C7").content("Tôi quan tâm đến quy định pháp luật, chuẩn mực")
                                        .category("RIASEC").build(),
                        Question.builder().code("C8").content("Tôi muốn làm việc với hệ thống quản lý dữ liệu")
                                        .category("RIASEC").build(),

                        // ====== TIPI (10 câu) ======
                        Question.builder().code("TIPI1").content("Tôi là người hòa đồng và hướng ngoại")
                                        .category("TIPI").build(),
                        Question.builder().code("TIPI2").content("Tôi thường lo lắng và dễ bị căng thẳng")
                                        .category("TIPI").build(),
                        Question.builder().code("TIPI3").content("Tôi là người rộng lượng và hợp tác").category("TIPI")
                                        .build(),
                        Question.builder().code("TIPI4").content("Tôi có tính cách ổn định và ít lo âu")
                                        .category("TIPI").build(),
                        Question.builder().code("TIPI5").content("Tôi thích khám phá những ý tưởng mới")
                                        .category("TIPI").build(),
                        Question.builder().code("TIPI6").content("Tôi là người có trách nhiệm và đáng tin cậy")
                                        .category("TIPI").build(),
                        Question.builder().code("TIPI7").content("Tôi ít quan tâm đến nghệ thuật và cái đẹp")
                                        .category("TIPI").build(),
                        Question.builder().code("TIPI8").content("Tôi thích giúp đỡ người khác").category("TIPI")
                                        .build(),
                        Question.builder().code("TIPI9").content("Tôi là người trầm tính và ít nói").category("TIPI")
                                        .build(),
                        Question.builder().code("TIPI10")
                                        .content("Tôi thích thử thách bản thân với những trải nghiệm mới")
                                        .category("TIPI").build(),

                        // ====== Demographics (3 câu) ======
                        Question.builder().code("gender").content("Giới tính của bạn là gì?").category("DEMOGRAPHIC")
                                        .build(),
                        Question.builder().code("urban").content("Bạn sống ở thành phố hay nông thôn?")
                                        .category("DEMOGRAPHIC").build());

        private void createQuestionIfNotExists(Question question) {
                if (!questionRepository.existsByCode(question.getCode())) {
                        questionRepository.save(question);
                        log.info("✅ Created default question: {}", question.getCode());
                }
        }

        @Override
        public void createDefaultQuestions() {
                DEFAULT_QUESTIONS.forEach(this::createQuestionIfNotExists);
        }

        /** ==================== TEST RESULTS ==================== */
        @Override
        public void createDefaultTestResults() {
                Random random = new Random();

                for (long userId = 2; userId <= 13; userId++) {
                        int resultCount = 2 + random.nextInt(2); // 2-3 kết quả mỗi user

                        for (int i = 0; i < resultCount; i++) {
                                try {
                                        Map<String, Integer> answersMap = new HashMap<>();

                                        // Sections A, C, E, I, R, S (1-8)
                                        String[] sections = { "A", "C", "E", "I", "R", "S" };
                                        for (String sec : sections) {
                                                for (int j = 1; j <= 8; j++) {
                                                        answersMap.put(sec + j, random.nextInt(5) + 1);
                                                }
                                        }

                                        // TIPI 1-10
                                        for (int j = 1; j <= 10; j++) {
                                                answersMap.put("TIPI" + j, random.nextInt(5) + 1);
                                        }

                                        // urban & gender
                                        answersMap.put("urban", random.nextInt(3) + 1);
                                        answersMap.put("gender", random.nextInt(2) + 1);

                                        // Chuyển map sang JSON
                                        ObjectMapper objectMapper = new ObjectMapper();
                                        String answersJson = objectMapper.writeValueAsString(answersMap);

                                        // Chọn ngẫu nhiên predictedMajor
                                        String[] majorGroups = {
                                                        "Khối Khoa Học Tự Nhiên",
                                                        "Khối Khoa Học Xã Hội"
                                        };
                                        String predictedMajor = majorGroups[random.nextInt(majorGroups.length)];

                                        // createdAt rải trong 30 ngày gần đây
                                        LocalDateTime createdAt = LocalDateTime.now()
                                                        .minus(random.nextInt(30), ChronoUnit.DAYS)
                                                        .minus(random.nextInt(24), ChronoUnit.HOURS)
                                                        .minus(random.nextInt(60), ChronoUnit.MINUTES);

                                        // Build và save TestResult
                                        TestResult result = TestResult.builder()
                                                        .userId(userId)
                                                        .answers(answersJson)
                                                        .predictedMajor(predictedMajor)
                                                        .createdAt(createdAt)
                                                        .build();

                                        testResultRepository.save(result);
                                } catch (Exception e) {
                                        e.printStackTrace();
                                }
                        }
                }
        }

        /** ==================== UTILS ==================== */
        private Role getRoleOrThrow(String roleName) {
                return roleRepository.findById(roleName)
                                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        }

        /** ==================== APP INIT ==================== */
        @PostConstruct
        public void init() {
                createDefaultRoles();
                createDefaultPermissions();
                createDefaultPermissionRole();
                createDefaultBlocks();
                createDefaultMajors();
                createDefaultQuestions();
                createAdminAccountIfNotExists();
                createTestTeacherAccountIfNotExists();
                createDefaultStudentsIfNotExists();
                // createDefaultTestResults();
        }
}