package com.qui.career_orientation.entity.dto.respond;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiRespond<T> {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private T data;

    public ApiRespond(HttpStatus status, String message, T data) {
        this.timestamp = LocalDateTime.now();
        this.status = status.value();
        this.message = message;
        this.data = data;
    }

    public static <T> ApiRespond<T> success(String message, T data) {
        return new ApiRespond<>(HttpStatus.OK, message, data);
    }

    public static <T> ApiRespond<T> created(String message, T data) {
        return new ApiRespond<>(HttpStatus.CREATED, message, data);
    }

    public static <T> ApiRespond<T> error(HttpStatus status, String message) {
        return new ApiRespond<>(status, message, null);
    }
}
