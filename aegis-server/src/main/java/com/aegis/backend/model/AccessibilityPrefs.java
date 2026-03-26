package com.aegis.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "accessibility_prefs")
public class AccessibilityPrefs {

    @Id
    @Column(name = "pref_id", length = 36)
    private String prefId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "dyslexia_support", nullable = false)
    private boolean dyslexiaSupport = false;

    @Column(name = "colour_blind_friendly", nullable = false)
    private boolean colourBlindFriendly = false;

    @Column(name = "high_contrast", nullable = false)
    private boolean highContrast = false;

    @Column(name = "large_touch_buttons", nullable = false)
    private boolean largeTouchButtons = false;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
