USE aegis;

Select * from companion_sessions; -- to see what all data is there before running the tests

-- Test 1a: Create valid session
-- Expected: 1 row inserted with status = PENDING
INSERT INTO companion_sessions
(session_id, user_id, companion_id, route_id, session_code)
VALUES (UUID(),
		'a1b2c3d4-0004-0004-0004-000000000004',
		'a1b2c3d4-0002-0002-0002-000000000002',
		'c1b2c3d4-0004-0004-0004-000000000004',
		'QR78ST');
SELECT session_id, status, session_code
FROM companion_sessions
WHERE session_code = 'QR78ST';

-- Test 1b: Try user as their own companion
-- Expected: ERROR — violates chk_companion_self
INSERT INTO companion_sessions
(session_id, user_id, companion_id, route_id, session_code)
VALUES (UUID(),
		'a1b2c3d4-0001-0001-0001-000000000001',
		'a1b2c3d4-0001-0001-0001-000000000001',
		'c1b2c3d4-0002-0002-0002-000000000002',
		'AA11BB');

-- Test 1c: Try duplicate session code
-- Expected: ERROR — violates uq_session_code
INSERT INTO companion_sessions
(session_id, user_id, companion_id, route_id, session_code)
VALUES (UUID(),
		'a1b2c3d4-0005-0005-0005-000000000005',
		'a1b2c3d4-0002-0002-0002-000000000002',
		'c1b2c3d4-0003-0003-0003-000000000003',
		'AB12CD');

-- Test 1d: Try duplicate user/companion/route
-- Expected: ERROR — violates uq_companion_sessions
INSERT INTO companion_sessions
(session_id, user_id, companion_id, route_id, session_code)
VALUES (UUID(),
		'a1b2c3d4-0001-0001-0001-000000000001',
		'a1b2c3d4-0002-0002-0002-000000000002',
		'c1b2c3d4-0001-0001-0001-000000000001',
		'ZZ99YY');

-- Test 2a: Valid join — PENDING becomes ACTIVE
-- Expected: 1 row updated and ACTIVE
UPDATE companion_sessions
SET status = 'ACTIVE'
WHERE session_code = 'QR78ST'
AND status = 'PENDING';
SELECT status FROM companion_sessions
WHERE session_code = 'QR78ST';

-- Test 2b: Try joining already ACTIVE session
-- Expected: 0 rows updated — already ACTIVE
UPDATE companion_sessions
SET status = 'ACTIVE'
WHERE session_code = 'QR78ST'
AND status = 'PENDING';

-- Test 2c: Try joining ENDED session
-- Expected: 0 rows updated — already ENDED
UPDATE companion_sessions
SET status = 'ACTIVE'
WHERE session_code = 'MN56PQ'
AND status = 'PENDING';

-- Test 2d: Try wrong code
-- Expected: 0 rows updated — code does not exist
UPDATE companion_sessions
SET status = 'ACTIVE'
WHERE session_code = 'XXXXXX'
AND status = 'PENDING';

-- Test 3a: Get valid session
-- Expected: Returns Mahima and Sara ACTIVE session
SELECT session_id, user_id, companion_id, route_id, status, started_at
FROM companion_sessions
WHERE session_code = 'AB12CD';

-- Test 3b: Get PENDING session
-- Expected: Returns PENDING session
SELECT session_id, user_id, companion_id, route_id, status, started_at
FROM companion_sessions
WHERE session_code = 'XY34ZW';

-- Test 3c: Get non-existent code
-- Expected: Empty
SELECT session_id, user_id, companion_id, route_id, status, started_at
FROM companion_sessions
WHERE session_code = 'XXXXXX';

-- Test 4a: Get sessions for Mahima
-- Expected: 2 rows — Sara (ACTIVE) and Companion Two (PENDING)
SELECT cs.session_id, u.full_name AS companion_name,
       cs.status, cs.started_at, cs.session_code
FROM companion_sessions cs
JOIN users u ON cs.companion_id = u.user_id
WHERE cs.user_id = 'a1b2c3d4-0001-0001-0001-000000000001'
AND cs.status IN ('PENDING', 'ACTIVE');

-- Test 4b: Get sessions for user with no active sessions
-- Expected: Empty — no route user has no sessions
SELECT cs.session_id, u.full_name AS companion_name,
       cs.status, cs.started_at, cs.session_code
FROM companion_sessions cs
JOIN users u ON cs.companion_id = u.user_id
WHERE cs.user_id = 'a1b2c3d4-0005-0005-0005-000000000005'
AND cs.status IN ('PENDING', 'ACTIVE');

-- Test 4c: ENDED sessions should NOT appear
-- Expected: Empty — Sara only has ENDED session
SELECT cs.session_id, u.full_name AS companion_name, cs.status
FROM companion_sessions cs
JOIN users u ON cs.companion_id = u.user_id
WHERE cs.user_id = 'a1b2c3d4-0002-0002-0002-000000000002'
AND cs.status IN ('PENDING', 'ACTIVE');

-- Test 5a: End active session
-- Expected: 1 row updated, status = ENDED, ended_at filled
UPDATE companion_sessions
SET status = 'ENDED',
    ended_at = CURRENT_TIMESTAMP
WHERE user_id = 'a1b2c3d4-0004-0004-0004-000000000004'
AND status IN ('PENDING', 'ACTIVE');
SELECT status, ended_at FROM companion_sessions
WHERE session_code = 'QR78ST';

-- Test 5b: Try ending already ENDED session
-- Expected: 0 rows updated as already ENDED
UPDATE companion_sessions
SET status = 'ENDED',
    ended_at = CURRENT_TIMESTAMP
WHERE user_id = 'a1b2c3d4-0002-0002-0002-000000000002'
AND status IN ('PENDING', 'ACTIVE');

-- Test 5c: Verify ended_at is after started_at
-- Expected: All show VALID
SELECT session_id, started_at, ended_at,
    CASE
        WHEN ended_at >= started_at THEN 'VALID'
        ELSE 'INVALID'
    END AS date_check
FROM companion_sessions
WHERE status = 'ENDED';

-- Test 6a: Get valid ACTIVE session
-- Expected: Returns Mahima Sara session
SELECT session_id, user_id, companion_id, route_id, status
FROM companion_sessions
WHERE session_id = 'e1b2c3d4-0001-0001-0001-000000000001'
AND status = 'ACTIVE';

-- Test 6b: Try getting PENDING session
-- Expected: Empty — session is PENDING not ACTIVE
SELECT session_id, user_id, companion_id, route_id, status
FROM companion_sessions
WHERE session_id = 'e1b2c3d4-0002-0002-0002-000000000002'
AND status = 'ACTIVE';

-- Test 6c: Try getting ENDED session
-- Expected: Empty — session is ENDED
SELECT session_id, user_id, companion_id, route_id, status
FROM companion_sessions
WHERE session_id = 'e1b2c3d4-0003-0003-0003-000000000003'
AND status = 'ACTIVE';

-- Test 7a: Check for inactive ACTIVE sessions
-- Expected: Returns sessions with no recent location update
-- Mahima/Sara session has recent fake data so may not appear. It depends on how recent your fake location_updates are
SELECT cs.session_id, cs.companion_id
FROM companion_sessions cs
WHERE cs.status = 'ACTIVE'
AND NOT EXISTS (
    SELECT 1 FROM location_updates lu
    WHERE lu.session_id = cs.session_id
    AND lu.recorded_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
);

-- Test 7.2: Verify PENDING sessions are excluded
-- Expected: Only ACTIVE sessions — PENDING and ENDED excluded
SELECT cs.session_id, cs.status
FROM companion_sessions cs
WHERE cs.status = 'ACTIVE';

-- CLEANUP
SET SQL_SAFE_UPDATES = 0;
DELETE FROM companion_sessions WHERE session_code = 'QR78ST';
SET SQL_SAFE_UPDATES = 1;