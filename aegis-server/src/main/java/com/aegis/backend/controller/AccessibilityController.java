package com.aegis.backend.controller;

import com.aegis.backend.dto.AccessibilityPrefsRequest;
import com.aegis.backend.model.AccessibilityPrefs;
import com.aegis.backend.service.AccessibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accessibility")
@RequiredArgsConstructor
public class AccessibilityController {

    private final AccessibilityService accessibilityService;

    @GetMapping
    public ResponseEntity<AccessibilityPrefs> getPrefs(Authentication authentication) {
        String email = authentication.getName();
        AccessibilityPrefs prefs = accessibilityService.getPrefs(email);
        if (prefs == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(prefs);
    }

    @PostMapping
    public ResponseEntity<AccessibilityPrefs> savePrefs(
            Authentication authentication,
            @RequestBody AccessibilityPrefsRequest request) {
        String email = authentication.getName();
        AccessibilityPrefs saved = accessibilityService.savePrefs(email, request);
        return ResponseEntity.ok(saved);
    }
}