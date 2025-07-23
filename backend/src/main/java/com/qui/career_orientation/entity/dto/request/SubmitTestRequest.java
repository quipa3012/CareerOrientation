package com.qui.career_orientation.entity.dto.request;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitTestRequest {
    private Map<String, Integer> answers; // {"Q1":5,"Q2":3,...}
}