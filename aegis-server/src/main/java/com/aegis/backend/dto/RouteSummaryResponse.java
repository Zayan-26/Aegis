package com.aegis.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class RouteSummaryResponse {
    private String token;
    private double safetyScore;
    private long duration;
    private double distance;
    private List<Map<String, Double>> coordinateArray;
}
