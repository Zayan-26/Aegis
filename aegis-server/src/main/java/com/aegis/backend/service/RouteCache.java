package com.aegis.backend.service;

import com.graphhopper.ResponsePath;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RouteCache {

    private final Map<String, ResponsePath> cache = new ConcurrentHashMap<>();

    public void store(String token, ResponsePath path) {
        cache.put(token, path);
    }

    public ResponsePath get(String token) {
        return cache.get(token);
    }

    public boolean exists(String token) {
        return cache.containsKey(token);
    }
}
