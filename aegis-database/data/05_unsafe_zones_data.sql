USE aegis;

INSERT INTO unsafe_zones (zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier) VALUES

-- Very unsafe zone (heavy penalty)
('Highgate Park Night Zone', 52.441000, -1.938000, 52.445000, -1.930000, 0.20),

-- Moderately unsafe zone
('Bristol Road Late Night', 52.448000, -1.935000, 52.455000, -1.925000, 0.50),

-- Slightly unsafe zone (minor penalty)
('Selly Oak Backstreets', 52.441000, -1.937000, 52.444000, -1.930000, 0.75),

-- Safe zone (no penalty)
('University Main Campus', 52.449000, -1.934000, 52.455000, -1.926000, 1.00);

SELECT * FROM unsafe_zones;