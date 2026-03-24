package com.aegis.backend.service;

import com.aegis.backend.dto.AccessibilityPrefsRequest;
import com.aegis.backend.model.AccessibilityPrefs;
import com.aegis.backend.repository.AccessibilityPrefsRepository;
import com.aegis.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccessibilityService {

    private final AccessibilityPrefsRepository accessibilityPrefsRepository;
    private final UserRepository userRepository;

    public AccessibilityPrefs getPrefs(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accessibilityPrefsRepository.findByUserId(user.getUserId())
                .orElse(null);
    }

    public AccessibilityPrefs savePrefs(String email, AccessibilityPrefsRequest request) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var prefs = accessibilityPrefsRepository.findByUserId(user.getUserId())
                .orElse(new AccessibilityPrefs());

        if (prefs.getPrefId() == null) {
            prefs.setPrefId(UUID.randomUUID().toString());
            prefs.setUserId(user.getUserId());
        }

        prefs.setDyslexiaSupport(request.isDyslexiaSupport());
        prefs.setColourBlindFriendly(request.isColourBlindFriendly());
        prefs.setHighContrast(request.isHighContrast());
        prefs.setLargeTouchButtons(request.isLargeTouchButtons());
        prefs.setUpdatedAt(LocalDateTime.now());

        return accessibilityPrefsRepository.save(prefs);
    }
}
