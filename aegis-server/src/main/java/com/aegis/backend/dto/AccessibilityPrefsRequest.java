package com.aegis.backend.dto;
import lombok.Data;

@Data
public class AccessibilityPrefsRequest {
    private boolean dyslexiaSupport;
    private boolean colourBlindFriendly;
    private boolean highContrast;
    private boolean largeTouchButtons;
}
