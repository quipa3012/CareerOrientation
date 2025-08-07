package com.qui.career_orientation.util.constant;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNAUTHENTICATED(1000, "Người dùng chưa xác thực", HttpStatus.UNAUTHORIZED),
    INVALID_INPUT(1001, "Dữ liệu nhập vào không hợp lệ", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002, "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    UNAUTHORIZED(1003, "Truy cập bị từ chối", HttpStatus.FORBIDDEN),
    COOKIE_NOT_FOUND(1004, "Không tìm thấy cookie", HttpStatus.BAD_REQUEST),
    JWT_INVALID(1005, "JWT không hợp lệ", HttpStatus.UNAUTHORIZED),
    JWT_EXPIRED(1006, "JWT đã hết hạn", HttpStatus.UNAUTHORIZED),
    PASSWORD_INVALID(1007, "Mật khẩu không đúng", HttpStatus.NOT_FOUND),
    USERNAME_ALREADY_EXISTS(1008, "Tên người dùng đã tồn tại", HttpStatus.CONFLICT),
    EMAIL_ALREADY_EXISTS(1009, "Email đã tồn tại", HttpStatus.CONFLICT),
    FILE_UPLOAD_FAILED(1010, "Tải lên tệp không thành công", HttpStatus.INTERNAL_SERVER_ERROR),
    CAN_NOT_SIGN_JWT(1008, "Không thể ký JWT", HttpStatus.INTERNAL_SERVER_ERROR),
    ROLE_ALREADY_EXIST(1009, "Vai trò đã tồn tại", HttpStatus.CONFLICT),
    ROLE_NOT_FOUND(1010, "Không tìm thấy vai trò", HttpStatus.NOT_FOUND),
    ROLE_USER_DOES_NOT_EXIST(1011, "Vai trò USER không tồn tại", HttpStatus.NOT_FOUND),
    PERMISSION_NOT_FOUND(1012, "Không tìm thấy quyền", HttpStatus.NOT_FOUND),
    PERMISSION_ALREADY_EXIST(1013, "Quyền đã tồn tại", HttpStatus.CONFLICT),
    INVALID_FILE_NAME(1014, "Tên tệp không hợp lệ", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE(1015, "Loại tệp không hợp lệ", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_CHANGED(1020, "Mật khẩu mặc định chưa được thay đổi", HttpStatus.BAD_REQUEST),
    CLAZZ_ALREADY_EXISTS(1021, "Lớp học đã tồn tại", HttpStatus.CONFLICT),
    CLAZZ_NOT_FOUND(1022, "Không tìm thấy lớp học", HttpStatus.NOT_FOUND),
    USER_ALREADY_IN_CLAZZ(1023, "Thành viên đã tồn tại trong lớp", HttpStatus.CONFLICT),
    USER_NOT_IN_CLAZZ(1024, "Thành viên không có trong lớp", HttpStatus.NOT_FOUND),
    BLOCK_NOT_FOUND(1025, "Không tìm thấy khối học", HttpStatus.NOT_FOUND),
    MAJOR_NOT_FOUND(1026, "Không tìm thấy ngành học", HttpStatus.NOT_FOUND),
    QUESTION_NOT_FOUND(1027, "Không tìm thấy câu hỏi", HttpStatus.NOT_FOUND),
    UNCATEGORIZED_EXCEPTION(1111, "Lỗi chưa được phân loại", HttpStatus.INTERNAL_SERVER_ERROR);

    final int code;
    final String message;
    private HttpStatusCode statusCode;
}
