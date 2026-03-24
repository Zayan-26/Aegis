USE aegis;

-- Query 1: Save or update preferences. When user completes setup or changes any toggel then it automatically inserts if first time, updates if already exists. 
INSERT INTO accessibility_prefs(pref_id, user_id, dyslexia_support, colour_blind_friendly, high_contrast, large_touch_buttons)
VALUES (UUID(), ?, ?, ?, ?, ?) as new_updated_record -- (or new_inserted_record)
ON DUPLICATE KEY UPDATE
	dyslexia_support = new_updated_record.dyslexia_support,
    colour_blind_friendly = new_updated_record.colour_blind_friendly,
    high_contrast = new_updated_record.high_contrast,
    large_touch_buttons = new_updated_record.large_touch_buttons,
    updated_at = CURRENT_TIMESTAMP;

-- Query 2: getting preferences by user_id. Its called when app loads to apply accessibility settings for a specific user.
SELECT dyslexia_support, colour_blind_friendly, high_contrast, large_touch_buttons
FROM accessibility_prefs
WHERE user_id = ?;

-- Query 3: Resetting all settings when user taps on Reset All settings button
UPDATE accessibility_prefs
SET dyslexia_support = FALSE,
	colour_blind_friendly = FALSE,
    high_contrast = FALSE,
    large_touch_buttons = FALSE
WHERE user_id = ?;

-- Query 4: getting all active users for the admin
SELECT COUNT(*) AS total_active_users
FROM users
WHERE is_active = TRUE;
