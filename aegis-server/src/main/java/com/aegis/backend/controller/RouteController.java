package com.aegis.backend.controller;

import com.aegis.backend.entity.UnsafeZone;
import com.aegis.backend.repository.UnsafeZoneRepository;
import com.aegis.backend.service.RoutingService;
import com.graphhopper.GHResponse;
import com.graphhopper.ResponsePath;
import com.graphhopper.util.PointList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID; // Import the UUID generator

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RoutingService routingService;

    @Autowired
    private UnsafeZoneRepository unsafeZoneRepository;

    @GetMapping("/calculate")
    public ResponseEntity<?> calculateRoute(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon) {

        List<UnsafeZone> dangerousZones = unsafeZoneRepository.findAll();
        GHResponse response = routingService.getRoute(startLat, startLon, endLat, endLon, dangerousZones);

        if (response.hasErrors()) {
            return ResponseEntity.badRequest().body(response.getErrors().toString());
        }

        ResponsePath path = response.getBest();
        PointList pointList = path.getPoints();
        
        // coordinate array
        List<Map<String, Double>> coordinateArray = new ArrayList<>();
        for (int i = 0; i < pointList.size(); i++) {
            coordinateArray.add(Map.of(
                    "latitude", pointList.getLat(i),
                    "longitude", pointList.getLon(i)
            ));
        }

        // 2. Generate a unique Token for this specific route
        String routeToken = UUID.randomUUID().toString();

        // mock safety score
        int safetyScore = 98; 
        
        // returning JSON format
        return ResponseEntity.ok(Map.of(
                "coordinateArray", coordinateArray,
                "safetyScore", safetyScore,
                "duration", path.getTime(),  
                "distance", path.getDistance(), 
                "token", routeToken
        ));
    }
}