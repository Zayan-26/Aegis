USE aegis;

-- Test 1.1: Insert valid location update
-- Expected: 1 row inserted
INSERT INTO location_updates (update_id, session_id, user_id, lat, lng, accuracy)
VALUES (
     UUID(),
    'e1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0001-0001-0001-000000000001',
     52.442000, -1.937000, 4.20
);
SELECT lat, lng, accuracy FROM location_updates
WHERE lat = 52.442000;

-- Test 1.2: Try invalid latitude > 90
-- Expected: ERROR — violates chk_location_lat
INSERT INTO location_updates (update_id, session_id, user_id, lat, lng, accuracy)
VALUES (
    UUID(),
    'e1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0001-0001-0001-000000000001',
     95.000000, -1.939288, 4.00
);

-- Test 1.3: Try negative accuracy
-- Expected: ERROR — violates chk_location_accuracy
INSERT INTO location_updates (update_id, session_id, user_id, lat, lng, accuracy)
VALUES (
    UUID(),
    'e1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0001-0001-0001-000000000001',
     52.440000, -1.939288, -5.00
);

-- Test 1.4: Try invalid session_id
-- Expected: ERROR — violates fk_location_session
INSERT INTO location_updates (update_id, session_id, user_id, lat, lng, accuracy)
VALUES (
    UUID(),
    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    'a1b2c3d4-0001-0001-0001-000000000001',
    52.440000, -1.939288, 4.00
);

-- Test 2.1: Get latest location for active session
-- Expected: Most recent coordinate (52.442000 from test insert)
SELECT lat, lng, accuracy, recorded_at
FROM location_updates
WHERE session_id = 'e1b2c3d4-0001-0001-0001-000000000001'
ORDER BY recorded_at DESC
LIMIT 1;

-- Test 2.2: Get latest for session with no updates
-- Expected: Empty — Companion Two session has no updates
SELECT lat, lng, accuracy, recorded_at
FROM location_updates
WHERE session_id = 'e1b2c3d4-0002-0002-0002-000000000002'
ORDER BY recorded_at DESC
LIMIT 1;

-- Test 3.1: Get full path in order
-- Expected: 6 rows in chronological order i.e.,(5 fake data + 1 test insert)
SELECT lat, lng, recorded_at
FROM location_updates
WHERE session_id = 'e1b2c3d4-0001-0001-0001-000000000001'
ORDER BY recorded_at ASC;

-- Test 4.1: Check inactivity for active session
-- Expected: Large number, the active session would be 1-2 min 
SELECT TIMESTAMPDIFF(MINUTE, MAX(recorded_at), NOW()) AS minutes_since_last_update
FROM location_updates
WHERE session_id = 'e1b2c3d4-0001-0001-0001-000000000001';

-- Test 4.2: Insert fresh update and check again
-- Expected: 0 — just inserted
INSERT INTO location_updates (update_id, session_id, user_id, lat, lng, accuracy)
VALUES (
    UUID(),
    'e1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0001-0001-0001-000000000001',
    52.441000, -1.938000, 3.50
);
SELECT TIMESTAMPDIFF(MINUTE, MAX(recorded_at), NOW()) AS minutes_since_last_update
FROM location_updates
WHERE session_id = 'e1b2c3d4-0001-0001-0001-000000000001';

-- Test 5.1: Count updates for active session
-- Expected: 8 (5 fake + 1 from test 1.1 + 1 from test 4.2 + 1 more)
SELECT COUNT(*) AS total_updates
FROM location_updates
WHERE session_id = 'e1b2c3d4-0001-0001-0001-000000000001';

-- Test 5.2: Count updates for session with no updates
-- Expected: 0
SELECT COUNT(*) AS total_updates
FROM location_updates
WHERE session_id = 'e1b2c3d4-0002-0002-0002-000000000002';

-- Test 6.1: Run cleanup — removes updates older than 7 days
-- for ENDED sessions
-- Expected: 0 rows deleted — no ended sessions with old data yet
DELETE lu FROM location_updates lu
JOIN companion_sessions cs ON lu.session_id = cs.session_id
WHERE cs.status = 'ENDED'
AND lu.recorded_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Test 6.2: Verify active session data untouched
-- Expected: Same count as before — active session not affected
SELECT COUNT(*) AS remaining_updates
FROM location_updates
WHERE session_id = 'e1b2c3d4-0001-0001-0001-000000000001';

-- CLEANUP TEST DATA
SET SQL_SAFE_UPDATES = 0;
DELETE FROM location_updates
WHERE lat IN (52.442000, 52.441000);
SET SQL_SAFE_UPDATES = 1;
