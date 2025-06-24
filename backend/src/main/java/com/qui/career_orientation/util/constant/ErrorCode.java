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
    UNAUTHENTICATED(1000, "User not authenticated", HttpStatus.UNAUTHORIZED),
    INVALID_INPUT(1001, "Invalid input provided", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHORIZED(1003, "Unauthorized access", HttpStatus.FORBIDDEN),

    CAN_NOT_SIGN_JWT(1004, "Cannot sign JWT", HttpStatus.INTERNAL_SERVER_ERROR),

    ROLE_ALREADY_EXIST(1005, "Role already exists", HttpStatus.CONFLICT),
    ROLE_NOT_FOUND(1006, "Role not found", HttpStatus.NOT_FOUND),
    ROLE_USER_DOES_NOT_EXIST(1007, "Role USER does not exist", HttpStatus.NOT_FOUND),

    PERMISSION_NOT_FOUND(1008, "Permission not found", HttpStatus.NOT_FOUND),
    PERMISSION_ALREADY_EXIST(1009, "Permission already exists", HttpStatus.CONFLICT),

    UNCATEGORIZED_EXCEPTION(1111, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR);

    final int code;
    final String message;
    private HttpStatusCode statusCode;

}
