-- Clear everything first
-- SET SQL_SAFE_UPDATES = 0;
-- DELETE FROM companion_sessions;
-- SET SQL_SAFE_UPDATES = 1;

INSERT INTO companion_sessions 
(session_id, user_id, companion_id, route_id, session_code, status, started_at, ended_at) 
VALUES

-- Mahima tracked by Sara — ACTIVE
('e1b2c3d4-0001-0001-0001-000000000001',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'a1b2c3d4-0002-0002-0002-000000000002',
 'c1b2c3d4-0001-0001-0001-000000000001',
 'AB12CD',
 'ACTIVE',
 '2026-03-15 22:30:00',
 NULL),

-- Mahima tracked by Companion Two — PENDING
('e1b2c3d4-0002-0002-0002-000000000002',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'a1b2c3d4-0006-0006-0006-000000000006',
 'c1b2c3d4-0001-0001-0001-000000000001',
 'XY34ZW',
 'PENDING',
 '2026-03-15 22:30:00',
 NULL),

-- Sara tracked by Mahima — ENDED
('e1b2c3d4-0003-0003-0003-000000000003',
 'a1b2c3d4-0002-0002-0002-000000000002',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'c1b2c3d4-0003-0003-0003-000000000003',
 'MN56PQ',
 'ENDED',
 '2026-03-16 14:00:00',
 '2026-03-16 14:42:00');
 
 -- SELECT session_id, session_code, status FROM companion_sessions;