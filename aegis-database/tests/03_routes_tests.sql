USE aegis;

-- Test 1 (for query 1): saving a new route.
-- Expected: a new row is inserted.
INSERT INTO routes (route_id, user_id, destination_name, origin_lat, origin_lng,
	destination_lat, destination_lng,
    route_type, safety_score,
    distance_km, duration_minutes,
    route_coordinates, is_saved)
VALUES (UUID(), 'a1b2c3d4-0001-0001-0001-000000000001', 'Test destination', 52.451870, -1.930796,
    52.440136, -1.939288, 'SAFEST', 88.50, 1.50, 20,
    '[{"lat":52.451870,"lng":-1.930796},{"lat":52.440136,"lng":-1.939288}]',
    FALSE);
-- Verify
SELECT * FROM routes WHERE destination_name = 'Test Destination';

-- Test 2: Get all routes for user Mahima
-- Excepted: Get 3 rows (if u havent run the test 1 before this otherwise there are 4 rows) for user Mahima ordered by most recent.
SELECT route_id, destination_name, route_type,
       safety_score, distance_km, duration_minutes,
       is_saved, requested_at
FROM routes
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001'
ORDER BY requested_at DESC;

-- Test 3: Get saved routes only.
-- Expected: Get the 2 saved routes for user Mahima.
SELECT route_id, destination_name, route_type,
       safety_score, distance_km, duration_minutes,
       requested_at
FROM routes
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001'
AND is_saved = TRUE
ORDER BY requested_at DESC;

-- Test 4: Get the most recent route
-- Expected: The most recent route for the user Mahima.
SELECT route_id, destination_name, route_type,
       safety_score, distance_km, duration_minutes,
       requested_at
FROM routes
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001'
ORDER BY requested_at DESC
LIMIT 1;

-- Test 5: Save route after arrival.
-- Expected: The value of is_saved = 1.
UPDATE routes
SET is_saved = TRUE
WHERE route_id = 'c1b2c3d4-0002-0002-0002-000000000002'
AND user_id = 'a1b2c3d4-0001-0001-0001-000000000001';
-- Verify expected: 1 row updated
SELECT route_id, is_saved FROM routes
WHERE route_id = 'c1b2c3d4-0002-0002-0002-000000000002';

-- Test 6: Get full route details.
-- Expected: Full details of Mahima's safest route.
SELECT route_id, destination_name, route_type,
       safety_score, distance_km, duration_minutes,
       route_coordinates, origin_lat, origin_lng,
       destination_lat, destination_lng, requested_at
FROM routes
WHERE route_id = 'c1b2c3d4-0001-0001-0001-000000000001'
AND user_id = 'a1b2c3d4-0001-0001-0001-000000000001';

-- Test 7: Delete unsaved routes older than 30 days.
-- Expected: 0 rows deleted (our fake data is recent).
DELETE FROM routes
WHERE is_saved = FALSE
AND requested_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Test 8: Analytics that gives the most popular destinations.
-- Expected: Selly Oak appears most.
SELECT destination_name,
       COUNT(*) AS journey_count,
       AVG(safety_score) AS avg_safety_score
FROM routes
WHERE safety_score IS NOT NULL
GROUP BY destination_name
ORDER BY journey_count DESC
LIMIT 10;

-- Test 9: Analytics - safest vs fastest preference.
-- Expected: Shows split between SAFEST and FASTEST.
SELECT route_type,
       COUNT(*) AS total,
       ROUND(COUNT(*) / (SELECT COUNT(*) FROM routes) * 100, 1) AS percentage
FROM routes
GROUP BY route_type;

-- Test 10: Analytics - get the safety by time of day.
-- Expected: Shows safety scores grouped by time.
SELECT
    CASE
        WHEN HOUR(requested_at) BETWEEN 6 AND 11  THEN 'MORNING'
        WHEN HOUR(requested_at) BETWEEN 12 AND 17 THEN 'AFTERNOON'
        WHEN HOUR(requested_at) BETWEEN 18 AND 20 THEN 'EVENING'
        ELSE 'NIGHT'
    END AS time_of_day,
    COUNT(*) AS total_routes,
    AVG(safety_score) AS avg_safety_score
FROM routes
WHERE safety_score IS NOT NULL
GROUP BY time_of_day
ORDER BY avg_safety_score DESC;

-- Test 11: Try invalid safety score.
-- Expected: ERROR - violates chk_routes_safety_score.
INSERT INTO routes (
    route_id, user_id, destination_name,
    origin_lat, origin_lng,
    destination_lat, destination_lng,
    route_type, safety_score,
    distance_km, duration_minutes,
    route_coordinates
)
VALUES (
    UUID(),
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Bad Score Test',
    52.451870, -1.930796,
    52.440136, -1.939288,
    'SAFEST', 150.00,
    1.50, 20,
    '[{"lat":52.451870,"lng":-1.930796}]'
);

-- Test 12: Try invalid route type.
-- Expected: ERROR - invalid ENUM value.
INSERT INTO routes (
    route_id, user_id, destination_name,
    origin_lat, origin_lng,
    destination_lat, destination_lng,
    route_type, safety_score,
    distance_km, duration_minutes,
    route_coordinates
)
VALUES (
    UUID(),
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Bad Type Test',
    52.451870, -1.930796,
    52.440136, -1.939288,
    'MEDIUM', 85.00,
    1.50, 20,
    '[{"lat":52.451870,"lng":-1.930796}]'
);

-- Cleaning up the test cases
-- SET SQL_SAFE_UPDATES = 0;
DELETE FROM routes WHERE destination_name = 'Test destination';
-- SET SQL_SAFE_UPDATES = 1;

Select * FROM routes; -- to check if the test case is removed

