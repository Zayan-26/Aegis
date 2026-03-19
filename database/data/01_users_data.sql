/*NOTE: MySQL does not have a true BOOLEAN datatype internally. For Column is_active the datatype is BOOLEAN in MySQL it 
        automatically converts it to TINYINT(1) behind the scenes.*/

CREATE DATABASE IF NOT EXISTS aegis;
USE aegis;

-- Mahima - active user being tracked
('a1b2c3d4-0001-0001-0001-000000000001',
 'Mahima Gupta',
 'mahima@gmail.com',
 '$2a$10$hashedpassword11111111111111111111111111111111111111111',
 TRUE,
 '2026-03-01 10:00:00',
 NULL),

-- Sara - companion user
('a1b2c3d4-0002-0002-0002-000000000002',
 'Sara Khan',
 'sara@gmail.com',
 '$2a$10$hashedpassword22222222222222222222222222222222222222222',
 TRUE,
 '2026-03-01 11:00:00',
 NULL),

-- Deleted user - soft delete example
('a1b2c3d4-0003-0003-0003-000000000003',
 'Deleted User',
 'deleted.user@gmail.com',
 '$2a$10$hashedpassword33333333333333333333333333333333333333333',
 FALSE,
 '2026-02-15 09:00:00',
 '2026-03-10 14:30:00'),

-- New user - just registered, no routes yet
('a1b2c3d4-0004-0004-0004-000000000004',
 'New User',
 'newuser@gmail.com',
 '$2a$10$hashedpassword44444444444444444444444444444444444444444',
 TRUE,
 '2026-03-17 08:00:00',
 NULL),

-- User who never took a route
('a1b2c3d4-0005-0005-0005-000000000005',
 'No Route User',
 'norouteuser@gmail.com',
 '$2a$10$hashedpassword55555555555555555555555555555555555555555',
 TRUE,
 '2026-03-10 15:00:00',
 NULL),

-- Second companion
('a1b2c3d4-0006-0006-0006-000000000006',
 'Companion Two',
 'companion2@gmail.com',
 '$2a$10$hashedpassword66666666666666666666666666666666666666666',
 TRUE,
 '2026-03-05 12:00:00',
 NULL);', '$2a$10$hashedpassword66666666666666666666666666666666666666666', TRUE, '2026-03-05 12:00:00', NULL);

