package com.aegis.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data // Lombok creats get methods automatically
@Entity
@Table(name = "05_unsafe_zones") // link to table
public class UnsafeZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String zoneName; 

    // Zone that GraphHopper will avoid
    private double minLat;
    private double minLon;
    private double maxLat;
    private double maxLon;

    // Safety multiplier
    private double safetyMultiplier; 
}