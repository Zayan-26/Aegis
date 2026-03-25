USE aegis;

DROP TABLE IF EXISTS unsafe_zones;

CREATE TABLE unsafe_zones (
    unsafe_zone_id INT NOT NULL AUTO_INCREMENT,
    zone_name VARCHAR(255) NOT NULL,
    min_lat DECIMAL(9,6) NOT NULL,
    min_lon DECIMAL(9,6) NOT NULL,
    max_lat DECIMAL(9,6) NOT NULL,
    max_lon DECIMAL(9,6) NOT NULL,
    safety_multiplier DECIMAL(3,2) NOT NULL,

    CONSTRAINT pk_unsafe_zones PRIMARY KEY (unsafe_zone_id),

    CONSTRAINT uq_unsafe_zones UNIQUE (zone_name),

    CONSTRAINT chk_safety_multiplier CHECK (safety_multiplier BETWEEN 0.00 AND 1.00),

    CONSTRAINT chk_lat_range_min CHECK (min_lat BETWEEN -90 AND 90),

    CONSTRAINT chk_lat_range_max CHECK (max_lat BETWEEN -90 AND 90),

    CONSTRAINT chk_lon_range_min CHECK (min_lon BETWEEN -180 AND 180),

    CONSTRAINT chk_lon_range_max CHECK (max_lon BETWEEN -180 AND 180),

    CONSTRAINT chk_lat_order CHECK (max_lat > min_lat),

    CONSTRAINT chk_lon_order CHECK (max_lon > min_lon)
);

CREATE INDEX idx_unsafe_zones_coords ON unsafe_zones(min_lat, min_lon, max_lat, max_lon);