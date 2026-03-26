USE aegis;

-- Query 1: Save new location update.Its called every 30 seconds by React Native background task
-- Spring Boot receives GPS and inserts here
-- WebSocket then immediately broadcasts to companion
INSERT INTO location_updates (update_id, session_id, user_id, lat, lng, accuracy)
VALUES (UUID(), ?, ?, ?, ?, ?);

-- Query 2: Get latest location for session. Its called by companion map to show current position
-- ORDER BY recorded_at DESC LIMIT 1 returns newest only
SELECT lat, lng, accuracy, recorded_at
FROM location_updates
WHERE session_id = ?
ORDER BY recorded_at DESC
LIMIT 1;

-- Query 3: Get full journey path.Its called after journey ends to draw actual path walked
-- Returns ALL updates in chronological order
-- Used to compare planned route vs actual route walked
SELECT lat, lng, recorded_at
FROM location_updates
WHERE session_id = ?
ORDER BY recorded_at ASC;

-- Query 4: Check last update time for inactivity.Its called by Spring Boot scheduled task every minute
-- Returns minutes since last GPS update
-- If result > 5 → send inactivity alert to companion
SELECT TIMESTAMPDIFF(MINUTE, MAX(recorded_at), NOW()) AS minutes_since_last_update
FROM location_updates
WHERE session_id = ?;

-- Query 5: Count total updates for session.Its called to verify GPS tracking is working correctly
SELECT COUNT(*) AS total_updates
FROM location_updates
WHERE session_id = ?;

-- Query 6: Cleanup old location updates.Its called by Spring Boot scheduled task weekly
-- Removes updates older than 7 days for ended sessions
-- Keeps database from growing too large
DELETE lu FROM location_updates lu
JOIN companion_sessions cs ON lu.session_id = cs.session_id
WHERE cs.status = 'ENDED'
AND lu.recorded_at < DATE_SUB(NOW(), INTERVAL 7 DAY);