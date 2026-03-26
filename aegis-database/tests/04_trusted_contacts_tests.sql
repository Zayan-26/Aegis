USE aegis;

-- TEST 1: Add new trusted contact
-- Expected: 1 row inserted
INSERT INTO trusted_contacts (contact_id, user_id, contact_user_id)
VALUES (UUID(),
	   'a1b2c3d4-0005-0005-0005-000000000005',
       'a1b2c3d4-0001-0001-0001-000000000001');
-- Verify
SELECT * FROM trusted_contacts
WHERE user_id = 'a1b2c3d4-0005-0005-0005-000000000005';

-- Test 2: Get all trusted contacts for Mahima
-- Expected: Sara and Companion Two
SELECT u.user_id, u.full_name, u.email
FROM trusted_contacts tc
JOIN users u ON tc.contact_user_id = u.user_id
WHERE tc.user_id = 'a1b2c3d4-0001-0001-0001-000000000001'
AND u.is_active = TRUE;

-- Test 3: Remove a trusted contact
-- Expected: empty, 1 row is deleted
SET SQL_SAFE_UPDATES = 0;
DELETE FROM trusted_contacts
WHERE user_id = 'a1b2c3d4-0005-0005-0005-000000000005'
AND contact_user_id = 'a1b2c3d4-0001-0001-0001-000000000001';
SET SQL_SAFE_UPDATES = 1;
-- Verify
SELECT * FROM trusted_contacts
WHERE user_id = 'a1b2c3d4-0005-0005-0005-000000000005';

-- Test 4: Check if contact already added
-- Expected: 1 (Mahima already has Sara)
SELECT COUNT(*) AS already_exists
FROM trusted_contacts
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001'
AND contact_user_id = 'a1b2c3d4-0002-0002-0002-000000000002';

-- Test 5a: Check if person has AEGIS account
-- Expected: Returns Sara's details
SELECT user_id, full_name, email
FROM users
WHERE email = 'sara@gmail.com'
AND is_active = TRUE;

-- Test 5b: Check non AEGIS user
-- Expected: Empty - person not in AEGIS
SELECT user_id, full_name, email
FROM users
WHERE email = 'notinapp@gmail.com'
AND is_active = TRUE;

-- Test 6: Get all users who have Mahima as contact
-- Expected: Sara and New User
SELECT u.user_id, u.full_name, u.email
FROM trusted_contacts tc
JOIN users u ON tc.user_id = u.user_id
WHERE tc.contact_user_id = 'a1b2c3d4-0001-0001-0001-000000000001'
AND u.is_active = TRUE;

-- Test 7: Count trusted contacts for Mahima
-- Expected: 2
SELECT COUNT(*) AS total_contacts
FROM trusted_contacts
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001';

-- Test 8: Try adding yourself as contact
-- Expected: ERROR - violates chk_trusted_contacts_self
INSERT INTO trusted_contacts (contact_id, user_id, contact_user_id)
VALUES (
    UUID(),
    'a1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0001-0001-0001-000000000001'
);

-- Test 9: Try adding duplicate contact
-- Expected: ERROR - violates uq_trusted_contacts
INSERT INTO trusted_contacts (contact_id, user_id, contact_user_id)
VALUES (
    UUID(),
    'a1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0002-0002-0002-000000000002'
);
