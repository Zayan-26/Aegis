USE aegis;

INSERT INTO trusted_contacts (contact_id, user_id, contact_user_id, created_at) VALUES

-- Mahima added Sara as trusted contact
('d1b2c3d4-0001-0001-0001-000000000001',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'a1b2c3d4-0002-0002-0002-000000000002',
 '2026-03-01 10:30:00'),

-- Mahima also added Companion Two
('d1b2c3d4-0002-0002-0002-000000000002',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'a1b2c3d4-0006-0006-0006-000000000006',
 '2026-03-01 10:35:00'),

-- Sara added Mahima as trusted contact
('d1b2c3d4-0003-0003-0003-000000000003',
 'a1b2c3d4-0002-0002-0002-000000000002',
 'a1b2c3d4-0001-0001-0001-000000000001',
 '2026-03-02 09:00:00'),

-- New user added Sara as trusted contact
('d1b2c3d4-0004-0004-0004-000000000004',
 'a1b2c3d4-0004-0004-0004-000000000004',
 'a1b2c3d4-0002-0002-0002-000000000002',
 '2026-03-17 08:30:00');

SELECT * FROM trusted_contacts;