USE aegis;

-- Query 1: save a new route. Its called when python returns route to Spring Boot. Stores the route user selected i.e., SAFEST to FASTEST
INSERT INTO routes(route_id, user_id, destination_name, origin_lat, origin_lng,
	destination_lat, destination_lng,
    route_type, safety_score,
    distance_km, duration_minutes,
    route_coordinates, is_saved)
VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE);

-- Query 2: getting al routes for the user. Its called when the user opens the history.
SELECT route_id, destination_name, route_type, safety_score, distance_km, duration_minutes, is_saved, requested_at
FROM routes
WHERE user_id = ?
ORDER BY requested_at DESC;

-- Query 3: Getting saved routes only. Its called when the user wants to see only saved routes
SELECT route_id, destination_name, route_type, safety_score, distance_km, duration_minutes,
		requested_at
FROM routes
WHERE user_id = ? AND is_saved = TRUE
ORDER BY requested_at DESC;

-- Query 4: get most recent route. Its called when user returns to home screen 
SELECT route_id, destination_name, route_type,
		safety_score, distance_km, duration_minutes,
        route_coordinates, requested_at
FROM routes
WHERE user_id = ? 
ORDER BY requested_at DESC
LIMIT 1;

-- Query 5: save routes after arrival. Its called when user taps save button on arrival screen
UPDATE routes
SET is_saved = TRUE
WHERE route_id = ? AND user_id = ?;

-- Query 6: get full route details. Its called when map needs to draw the route.
SELECT route_id, destincation_name, route_type, safety_score, distance_km, duration_minutes,
	   route_coordinates, origin_lat, origin_lng, destination_lat, destination_lng, requested_at
FROM routes
WHERE routes_id = ? AND user_id = ?;
       
-- Query 7: Delete unsaved routes older than 30 days. Its cleanup query, keeps database from growing too large. Run periodically by Spring Boot scheduled task.
DELETE FROM routes
WHERE is_saved = FALSE AND requested_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Query 8: Analytics - most popular destinations. Shows which destination users travel to most.
SELECT destination_name,
		COUNT(*) AS journey_count,
        AVG(safety_score) AS avg_safety_score
FROM routes
WHERE safety_score IS NOT NULL
GROUP BY destination_name
ORDER BY journey_count DESC
LIMIT 10;

-- Query 9: Analytics - safest vs fastest preference. Shows how many users prefer safest vs fastest route.
SELECT route_type,
	COUNT(*) AS total, 
    ROUND(COUNT(*) / (SELECT COUNT(*) FROM routes) * 100, 1) AS percentage
FROM routes
GROUP BY route_types;

-- Query 10: Analytics - average safety score by time. Show which time of day has safest routes.
SELECT 
	CASE
		WHEN HOUR(requested_at) BETWEEN 6 AND 11 THEN 'MORNING'
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






       