package com.penguin.template.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ApiResponse {
    private boolean result;
    private String message;
}
