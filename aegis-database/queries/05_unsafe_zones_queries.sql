USE aegis;

-- Query 1: Get all unsafe zones
SELECT unsafe_zone_id, zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier
FROM unsafe_zones
ORDER BY safety_multiplier ASC;

-- Query 2: Find zones containing a specific coordinate
-- The '?' here represents the actual GPS coordinate that Spring Boot will pass in when checking if a street edge falls inside a danger zone.
-- In the queries file '?' means a placeholder — Spring Boot replaces it with a real value at runtime.
SELECT zone_name, safety_multiplier
FROM unsafe_zones
WHERE ? BETWEEN min_lat AND max_lat 
AND ? BETWEEN min_lon AND max_lon;

-- Query 3: Add new unsafe zone
INSERT INTO unsafe_zones (zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier)
VALUES (?, ?, ?, ?, ?, ?);

-- Query 4: Update safety multiplier
UPDATE unsafe_zones
SET safety_multiplier = ?
WHERE unsafe_zone_id = ?;

-- Query 5: Delete a zone
SET SQL_SAFE_UPDATES = 0;
DELETE FROM unsafe_zones WHERE unsafe_zone_id = ?;
SET SQL_SAFE_UPDATES = 1;

-- Query 6: Get most dangerous zones
SELECT zone_name, safety_multiplier
FROM unsafe_zones
WHERE safety_multiplier < 0.50
ORDER BY safety_multiplier ASC;