USE aegis;

-- Query 1: Add trusted contact. Its called when user selects a contact from their phone. contact_user_id must already have an AEGIS account.
INSERT INTO trusted_contacts (contact_id, user_id, contact_user_id)
VALUES (UUID(), ?, ?);

-- Query 2: Get all trusted contacts for a user. It called when user opens Share Journey screen and returns full name and email of each trusted contact.
SELECT u.user_id, u.full_name, u.email
FROM trusted_contacts tc
JOIN users u ON tc.contact_user_id = u.user_id
WHERE tc.user_id = ?
AND u.is_active = TRUE;

-- Query 3: Remove a trusted contact. Its called when user removes someone from trusted contacts.
DELETE FROM trusted_contacts
WHERE user_id = ?
AND contact_user_id = ?;

-- Query 4: Check if contact already added. Its called before adding to prevent duplicates.
SELECT COUNT(*) AS already_exists
FROM trusted_contacts
WHERE user_id = ?
AND contact_user_id = ?;

-- Query 5: Check if person has AEGIS account. Its called when user selects contact from phone and checks if their email matches an AEGIS account.
SELECT user_id, full_name, email
FROM users
WHERE email = ?
AND is_active = TRUE;

-- Query 6: Get all users who have this person as contact. Its called when journey starts to notify all trusted contacts.
SELECT u.user_id, u.full_name, u.email
FROM trusted_contacts tc
JOIN users u ON tc.user_id = u.user_id
WHERE tc.contact_user_id = ?
AND u.is_active = TRUE;

-- Query 7: Count trusted contacts for a user. Its called to show number of trusted contacts on profile screen.
SELECT COUNT(*) AS total_contacts
FROM trusted_contacts
WHERE user_id = ?;
