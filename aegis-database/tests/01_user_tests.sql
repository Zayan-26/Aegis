CREATE DATABASE IF NOT EXISTS aegis; --create database if it doesn't exist
USE aegis;

/*Test 11, 12, 13 will give errors */

--  TEST 1: Register new user 
-- Expected: 1 row inserted successfully
INSERT INTO users (user_id, full_name, email, password_hash)
VALUES (
    UUID(),
    'Test User',
    'testuser@gmail.com',
    '$2a$10$hashedpassword99999999999999999999999999999999999999999'
);
-- Verify:
SELECT * FROM users WHERE email = 'testuser@gmail.com';

-- TEST 2: Login with correct email ─────────────────────────
-- Expected: Returns Mahima's row
SELECT user_id, full_name, email, password_hash
FROM users
WHERE email = 'mahima@gmail.com'
AND is_active = TRUE;

--TEST 3: Login with deleted account ───────────────────────
-- Expected: Returns empty — deleted user cannot log in
SELECT user_id, full_name, email
FROM users
WHERE email = 'deleted.user@gmail.com'
AND is_active = TRUE;

--TEST 4: Login with wrong email 
-- Expected: Returns empty — email doesn't exist
SELECT user_id, full_name, email
FROM users
WHERE email = 'wrongemail@gmail.com'
AND is_active = TRUE;

--  TEST 5: Check duplicate email 
-- Expected: Returns 1 — email already exists
SELECT COUNT(*) AS email_count
FROM users
WHERE email = 'mahima@gmail.com';

--  TEST 6: Check non existing email 
-- Expected: Returns 0 — email doesn't exist
SELECT COUNT(*) AS email_count
FROM users
WHERE email = 'brandnew@gmail.com';

--  TEST 7: Get active user profile
-- Expected: Returns Mahima's profile without password_hash
SELECT user_id, full_name, email, is_active, created_at
FROM users
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001' --remove the user_id to all active users
AND is_active = TRUE;

-- ─── TEST 8: Get deleted user profile 
-- Expected: Returns empty — deleted user has no active profile
SELECT user_id, full_name, email, is_active, created_at
FROM users
WHERE user_id = 'a1b2c3d4-0003-0003-0003-000000000003'
AND is_active = TRUE;

--  TEST 9: Update full name 
-- Expected: 1 row updated
UPDATE users
SET full_name = 'Mahima Sharma'
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001'
AND is_active = TRUE;
-- Verify:
SELECT full_name FROM users
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001';

--  TEST 10: Deactivate account 
-- Expected: 1 row updated, is_active becomes FALSE
UPDATE users
SET is_active = FALSE,
    deactivated_at = CURRENT_TIMESTAMP
WHERE user_id = 'a1b2c3d4-0004-0004-0004-000000000004'
AND is_active = TRUE;
-- Verify:
SELECT user_id, full_name, is_active, deactivated_at
FROM users
WHERE user_id = 'a1b2c3d4-0004-0004-0004-000000000004';

--  TEST 11: Try invalid email format 
-- Expected: ERROR — violates chk_users_email constraint
INSERT INTO users (user_id, full_name, email, password_hash)
VALUES (
    UUID(),
    'Bad Email',
    'notanemail',
    '$2a$10$hashedpassword99999999999999999999999999999999999999999'
);

--  TEST 12: Try plain text password 
-- Expected: ERROR — violates chk_users_password constraint
INSERT INTO users (user_id, full_name, email, password_hash)
VALUES (
    UUID(),
    'Plain Password',
    'plainpassword@gmail.com',
    'plaintext123'
);

--  TEST 13: Try duplicate email 
-- Expected: ERROR — violates uq_users_email constraint
INSERT INTO users (user_id, full_name, email, password_hash)
VALUES (
    UUID(),
    'Duplicate Email',
    'mahima@gmail.com',
    '$2a$10$hashedpassword99999999999999999999999999999999999999999'
);

--  CLEANUP TEST DATA 
-- Run this after testing to remove test records
DELETE FROM users WHERE email = 'testuser@gmail.com';