package com.aegis.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
public class RouteController {

    @Autowired
    private RoutingService routingService;

    @Autowired
    private UnsafeZoneRepository unsafeZoneRepository;

    @Autowired
    private RouteCache routeCache;

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

        List<Map<String, Object>> routes = new ArrayList<>();

        for (ResponsePath path : response.getAll()) {
            PointList pointList = path.getPoints();

            List<Map<String, Double>> coordinateArray = new ArrayList<>();
            for (int i = 0; i < pointList.size(); i++) {
                coordinateArray.add(Map.of(
                        "latitude", pointList.getLat(i),
                        "longitude", pointList.getLon(i)
                ));
            }

            String routeToken = UUID.randomUUID().toString();
            routeCache.store(routeToken, path);

            int safetyScore = 98;

            routes.add(Map.of(
                    "coordinateArray", coordinateArray,
                    "safetyScore", safetyScore,
                    "duration", path.getTime() / 60000,
                    "distance", path.getDistance(),
                    "token", routeToken
            ));
        }

        return ResponseEntity.ok(routes);
    }

    @GetMapping("/{token}/navigation")
    public ResponseEntity<?> getNavigation(@PathVariable String token) {
        if (!routeCache.exists(token)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Route token not found or expired",
                    "status", 400
            ));
        }

        ResponsePath path = routeCache.get(token);

        List<Map<String, Object>> instructions = new ArrayList<>();
        for (var instruction : path.getInstructions()) {
             instructions.add(Map.of(
                     "text", instruction.getName().isEmpty() ? "Continue" : instruction.getName(),
                     "distance", instruction.getDistance(),
                     "direction", instruction.getSign()
        ));
    }

        return ResponseEntity.ok(Map.of(
                "token", token,
                "instructions", instructions
        ));
    }
}