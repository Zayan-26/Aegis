USE aegis;

-- Test 1: Get all zones ordered by most dangerous
-- Expected: 4 rows, Highgate Park first (0.20), University last (1.00)
SELECT unsafe_zone_id, zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier
FROM unsafe_zones
ORDER BY safety_multiplier ASC;

-- Test 2a: Route covers entire Selly Oak area
-- Expected: All 4 zones returned
SELECT unsafe_zone_id, zone_name, safety_multiplier
FROM unsafe_zones
WHERE min_lat <= 52.461872
AND max_lat >= 52.440136
AND min_lon <= -1.907945
AND max_lon >= -1.939288;

-- Test 2b: Small route in north of area only
-- Expected: Only zones in north area returned
SELECT unsafe_zone_id, zone_name, safety_multiplier
FROM unsafe_zones
WHERE min_lat <= 52.461872
AND max_lat >= 52.455000
AND min_lon <= -1.910000
AND max_lon >= -1.930000;


-- Test 2c: Route in area with no danger zones
-- Expected: Empty as there are no zones in this tiny area
SELECT unsafe_zone_id, zone_name, safety_multiplier
FROM unsafe_zones
WHERE min_lat <= 52.461872
AND max_lat >= 52.460000
AND min_lon <= -1.908000
AND max_lon >= -1.909000;

-- Test 3a: Add valid new zone
-- Expected: 1 row inserted
INSERT INTO unsafe_zones (zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier)
VALUES ('Test Danger Zone', 52.455000, -1.932000, 52.460000, -1.925000, 0.40);
SELECT * FROM unsafe_zones WHERE zone_name = 'Test Danger Zone';

-- Test 3b: Try duplicate zone name
-- Expected: ERROR — violates uq_unsafe_zones_name
INSERT INTO unsafe_zones (zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier)
VALUES ('Highgate Park Night Zone', 52.442000, -1.936000, 52.446000, -1.929000, 0.30);

-- Test 3c: Try multiplier above 1
-- Expected: ERROR — violates chk_multiplier
INSERT INTO unsafe_zones (zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier)
VALUES ('Bad Multiplier Zone', 52.442000, -1.936000, 52.446000, -1.929000, 1.50);

-- Test 3d: Try multiplier below 0
-- Expected: ERROR — violates chk_multiplier
INSERT INTO unsafe_zones (zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier)
VALUES ('Negative Zone', 52.442000, -1.936000, 52.446000, -1.929000, -0.50);

-- Test 3e: Try min_lat greater than max_lat
-- Expected: ERROR — violates chk_lat_order
INSERT INTO unsafe_zones (zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier)
VALUES ('Flipped Lat Zone', 52.460000, -1.932000, 52.455000, -1.925000, 0.50);

-- Test 3f: Try min_lon greater than max_lon
-- Expected: ERROR — violates chk_lon_order
INSERT INTO unsafe_zones (zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier)
VALUES ('Flipped Lon Zone', 52.455000, -1.920000, 52.460000, -1.930000, 0.50);

-- Test 4a: Update multiplier to safer value
-- Expected: 1 row updated and shows 0.60
UPDATE unsafe_zones
SET safety_multiplier = 0.60
WHERE zone_name = 'Test Danger Zone';
SELECT zone_name, safety_multiplier
FROM unsafe_zones
WHERE zone_name = 'Test Danger Zone';

-- Test 4b: Try updating to invalid multiplier
-- Expected: ERROR — violates chk_multiplier
UPDATE unsafe_zones
SET safety_multiplier = 1.50
WHERE zone_name = 'Test Danger Zone';

-- Test 4c: Try updating non-existent zone
-- Expected: 0 rows updated as the zone does not exist
UPDATE unsafe_zones
SET safety_multiplier = 0.50
WHERE unsafe_zone_id = 9999;

-- Test 5a: Delete test zone by unsafe_zone_id
-- Expected: 1 row deleted and then empty
SET SQL_SAFE_UPDATES = 0;
DELETE FROM unsafe_zones
WHERE zone_name = 'Test Danger Zone';
SET SQL_SAFE_UPDATES = 1;
SELECT * FROM unsafe_zones WHERE zone_name = 'Test Danger Zone';

-- Test 5b: Delete non-existent zone
-- Expected: 0 rows deleted — no error, just nothing happens
SET SQL_SAFE_UPDATES = 0;
DELETE FROM unsafe_zones WHERE unsafe_zone_id = 9999;
SET SQL_SAFE_UPDATES = 1;

-- Test 6a: All existing zones should be inside boundary
-- Expected: All 4 zones show INSIDE boundary
SELECT zone_name,
    CASE
        WHEN min_lat >= 52.440136
         AND max_lat <= 52.461872
         AND min_lon >= -1.939288
         AND max_lon <= -1.907945
        THEN 'INSIDE boundary'
        ELSE 'OUTSIDE boundary'
    END AS boundary_check
FROM unsafe_zones;

-- Test 6b: Add zone outside boundary then verify
-- Expected: Outside Zone shows OUTSIDE boundary
INSERT INTO unsafe_zones (zone_name, min_lat, min_lon, max_lat, max_lon, safety_multiplier)
VALUES ('Outside Zone', 52.430000, -1.960000, 52.435000, -1.950000, 0.30);
SELECT zone_name,
    CASE
        WHEN min_lat >= 52.440136
         AND max_lat <= 52.461872
         AND min_lon >= -1.939288
         AND max_lon <= -1.907945
        THEN 'INSIDE boundary'
        ELSE 'OUTSIDE boundary'
    END AS boundary_check
FROM unsafe_zones;

-- CLEANUP
SET SQL_SAFE_UPDATES = 0;
DELETE FROM unsafe_zones WHERE zone_name = 'Outside Zone';
SET SQL_SAFE_UPDATES = 1;