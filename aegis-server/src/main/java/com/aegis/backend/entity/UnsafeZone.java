package com.aegis.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "unsafe_zones")
public class UnsafeZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "unsafe_zone_id") 
    private Long id;

    @Column(name = "zone_name") 
    private String zoneName; 

    @Column(name = "min_lat")
    private double minLat;

    @Column(name = "min_lon")
    private double minLon;

    @Column(name = "max_lat")
    private double maxLat;

    @Column(name = "max_lon")
    private double maxLon;

    @Column(name = "safety_multiplier")
    private double safetyMultiplier; 
}