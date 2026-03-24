package com.aegis.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aegis.backend.service.RoutingService;
import com.graphhopper.GHResponse;
import com.graphhopper.ResponsePath;
import com.graphhopper.util.PointList;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RoutingService routingService;

    @GetMapping("/calculate")
    public ResponseEntity<?> calculateRoute(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon) {

        // Calculating the Route using RoutingService
        GHResponse response = routingService.getRoute(startLat, startLon, endLat, endLon);

        // Return errors for any invalid cooordinates
        if (response.hasErrors()) {
            return ResponseEntity.badRequest().body(response.getErrors().toString());
        }

        // Get best path
        ResponsePath path = response.getBest();
        PointList pointList = path.getPoints();
        
        // List for frontend
        List<Map<String, Double>> coordinates = new ArrayList<>();
        for (int i = 0; i < pointList.size(); i++) {
            coordinates.add(Map.of(
                    "latitude", pointList.getLat(i),
                    "longitude", pointList.getLon(i)
            ));
        }
        

        
        // Put results into a JSON response
        return ResponseEntity.ok(Map.of(
                "distance_meters", path.getDistance(),
                "time_milliseconds", path.getTime(),
                "points", coordinates 
        ));
    }
}