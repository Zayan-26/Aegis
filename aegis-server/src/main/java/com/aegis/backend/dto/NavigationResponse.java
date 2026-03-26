package com.aegis.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class NavigationResponse {
    private String token;
    private List<Map<String, Object>> instructions;
}