USE aegis;

-- Testing Query 1: First time insertion as NoRouteUser has no preference yet.
INSERT INTO accessibility_prefs(pref_id, user_id, dyslexia_support, colour_blind_friendly, high_contrast, large_touch_buttons)
VALUES (UUID(),'a1b2c3d4-0005-0005-0005-000000000005', TRUE, FALSE, TRUE, FALSE) AS new_inserted_record
ON DUPLICATE KEY UPDATE
	dyslexia_support = new_inserted_record.dyslexia_support,
    colour_blind_friendly = new_inserted_record.colour_blind_friendly,
    high_contrast = new_inserted_record.high_contrast,
    large_touch_buttons = new_inserted_record.large_touch_buttons,
    updated_at = CURRENT_TIMESTAMP;
-- verify insert worked:
SELECT * FROM accessibility_prefs
WHERE user_id = 'a1b2c3d4-0005-0005-0005-000000000005';

-- Testing Query 1: First time insert, Mahima already has prefs - this should UPDATE not INSERT
INSERT INTO accessibility_prefs (pref_id, user_id, dyslexia_support, colour_blind_friendly, high_contrast, large_touch_buttons)
VALUES (UUID(), 'a1b2c3d4-0001-0001-0001-000000000001', FALSE, TRUE, TRUE, TRUE) as new_updated_record
ON DUPLICATE KEY UPDATE 
	dyslexia_support = new_updated_record.dyslexia_support,
	colour_blind_friendly = new_updated_record.colour_blind_friendly,
    high_contrast = new_updated_record.high_contrast,
    large_touch_buttons = new_updated_record.large_touch_buttons,
    updated_at = CURRENT_TIMESTAMP;
-- verify updated worked (should show new values):
SELECT * FROM accessibility_prefs
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001';

-- Testing Query 2 - GET preferences
SELECT dyslexia_support, colour_blind_friendly, high_contrast, large_touch_buttons
FROM accessibility_prefs
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001';

-- Testing Query 3 - Resetting all settings for user (with id = 0002)
UPDATE accessibility_prefs
SET dyslexia_support = FALSE,
	colour_blind_friendly = FALSE,
    high_contrast = FALSE, 
    large_touch_buttons = FALSE,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = 'a1b2c3d4-0002-0002-0002-000000000002';
-- Verify reset worked
SELECT * FROM accessibility_prefs
WHERE user_id = 'a1b2c3d4-0002-0002-0002-000000000002';
