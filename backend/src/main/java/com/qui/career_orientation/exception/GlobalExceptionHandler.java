package com.qui.career_orientation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.qui.career_orientation.entity.dto.respond.ApiRespond;
import com.qui.career_orientation.util.constant.ErrorCode;

import lombok.Data;

@ControllerAdvice
@Data
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiRespond<?>> handleRuntimeException(RuntimeException ex, WebRequest request) {
        String message = ex.getMessage();
        String path = request.getDescription(false);
        String fullMessage = message + " (" + path + ")";
        ApiRespond<?> error = ApiRespond.error(HttpStatus.BAD_REQUEST, fullMessage);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiRespond<?>> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        String message = ex.getMessage();
        String path = request.getDescription(false);
        String fullMessage = message + " (" + path + ")";
        ApiRespond<?> error = ApiRespond.error(HttpStatus.NOT_FOUND, fullMessage);
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiRespond<?>> handleAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiRespond<?> apiRespond = new ApiRespond<>();

        apiRespond.setStatus(errorCode.getCode());
        apiRespond.setMessage(errorCode.getMessage());
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(apiRespond);

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiRespond<?>> handleAllExceptions(Exception ex, WebRequest request) {
        String path = request.getDescription(false);
        String fullMessage = "Internal Server Error (" + path + ")";
        ApiRespond<?> error = ApiRespond.error(HttpStatus.INTERNAL_SERVER_ERROR, fullMessage);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiRespond<?>> handingAccessDeniedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(
                        ApiRespond.builder()
                                .status(errorCode.getCode())
                                .message(errorCode.getMessage())
                                .build());
    }

}
