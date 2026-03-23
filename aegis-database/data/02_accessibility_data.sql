USE aegis;
INSERT INTO  accessibility_prefs(pref_id, user_id, dyslexia_support, colour_blind_friendly, high_contrast, large_touch_buttons) VALUES
-- user Mahima has dyslexic support and large buttons on
('b1b2c3d4-0001-0001-0001-000000000001',
 'a1b2c3d4-0001-0001-0001-000000000001',
TRUE,
FALSE,
FALSE,
TRUE),

-- companion Sara has colour blind friendly and high constract on
('b1b2c3d4-0002-0002-0002-000000000002',
 'a1b2c3d4-0002-0002-0002-000000000002',
 FALSE,
 TRUE,
 TRUE,
 FALSE),
 
-- User with id 0003 is deleted user
 
-- new user has all settings on
('b1b2c3d4-0004-0004-0004-000000000004',
 'a1b2c3d4-0004-0004-0004-000000000004',
 TRUE,
 TRUE,
 TRUE,
 TRUE),
 
-- noRouteUser (with id 0005) has no preferences record. The test where the user has skipped accessibility setup.

-- companion no. TWO has all settings off
('b1b2c3d4-0006-0006-0006-000000000006',
 'a1b2c3d4-0006-0006-0006-000000000006',
 FALSE,
 FALSE,
 FALSE,
 FALSE);

-- SELECT * FROM accessibility_prefs;