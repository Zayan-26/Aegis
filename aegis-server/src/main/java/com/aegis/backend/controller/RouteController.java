package com.aegis.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aegis.backend.entity.UnsafeZone;
import com.aegis.backend.repository.UnsafeZoneRepository;
import com.aegis.backend.service.RouteCache;
import com.aegis.backend.service.RoutingService;
import com.graphhopper.GHResponse;
import com.graphhopper.ResponsePath;
import com.graphhopper.util.PointList;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    @Autowired
    private RoutingService routingService;

    @Autowired
    private UnsafeZoneRepository unsafeZoneRepository;

    @Autowired
    private RouteCache routeCache;

    @GetMapping(value = "/calculate", produces = "application/json")
    public ResponseEntity<?> calculateRoute(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon) {

        // retrieve unsafe zones from database
        List<UnsafeZone> dangerousZones = unsafeZoneRepository.findAll();

        // fastest route calculation
        GHResponse fastestResponse = routingService.getRoute(startLat, startLon, endLat, endLon, new ArrayList<>());
        if (fastestResponse.hasErrors()) {
            return ResponseEntity.badRequest().body("Fastest Route Error: " + fastestResponse.getErrors().toString());
        }

        // safest route calculation
        GHResponse safestResponse = routingService.getRoute(startLat, startLon, endLat, endLon, dangerousZones);
        if (safestResponse.hasErrors()) {
            return ResponseEntity.badRequest().body("Safest Route Error: " + safestResponse.getErrors().toString());
        }

        // score calculation
        int fastestScore = calculateSafetyScore(fastestResponse.getBest().getPoints(), dangerousZones);
        int safestScore = calculateSafetyScore(safestResponse.getBest().getPoints(), dangerousZones);

        // array fro frontend
        List<Map<String, Object>> safetyRouteArray = new ArrayList<>();

        // add routes to array with scores
        safetyRouteArray.add(formatRouteData(fastestResponse.getBest(), fastestScore));
        safetyRouteArray.add(formatRouteData(safestResponse.getBest(), safestScore));

        return ResponseEntity.ok(safetyRouteArray);
    }

    private int calculateSafetyScore(PointList points, List<UnsafeZone> zones) {
        double currentScore = 100.0; 
        List<Long> unsafeZoneIds = new ArrayList<>(); 

        // Looping through coordinates on route
        for (int i = 0; i < points.size(); i++) {
            double lat = points.getLat(i);
            double lon = points.getLon(i);

            // check to see we are in an unsafe area
            for (UnsafeZone zone : zones) {
                // add penalty if we have went in unsafe zone
                if (!unsafeZoneIds.contains(zone.getId())) {
                    
                    if (lat >= zone.getMinLat() && lat <= zone.getMaxLat() &&
                        lon >= zone.getMinLon() && lon <= zone.getMaxLon()) {
                        
                        // penalty calculation
                        currentScore = currentScore * zone.getSafetyMultiplier();
                        
                        // check to make sure multiple penalties aren't applied
                        unsafeZoneIds.add(zone.getId());
                    }
                }
            }
        }
        return (int) Math.max(0, Math.round(currentScore));
    }

    //formatting method so it is passed to frontend in desired format
    private Map<String, Object> formatRouteData(ResponsePath path, int safetyScore) {
        PointList pointList = path.getPoints();
        List<Map<String, Double>> coordinateArray = new ArrayList<>();
        
        for (int i = 0; i < pointList.size(); i++) {
            coordinateArray.add(Map.of(
                    "latitude", pointList.getLat(i),
                    "longitude", pointList.getLon(i)
            ));
        }
        return Map.of(
                "coordinateArray", coordinateArray,
                "safetyScore", safetyScore,
                "duration", path.getTime(),  
                "distance", path.getDistance(),
                "token", UUID.randomUUID().toString()
        );
    }
}