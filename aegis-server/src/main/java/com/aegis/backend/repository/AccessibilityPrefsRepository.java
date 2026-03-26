package com.aegis.backend.repository;

import com.aegis.backend.model.AccessibilityPrefs;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccessibilityPrefsRepository extends JpaRepository<AccessibilityPrefs, String> {
    Optional<AccessibilityPrefs> findByUserId(String userId);
}
