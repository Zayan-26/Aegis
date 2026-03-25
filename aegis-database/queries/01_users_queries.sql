CREATE DATABASE IF NOT EXISTS aegis; -- create database if it doesn't exist
USE aegis;

-- Query 1: register new user -> called when user taps CREATE ACCOUNT
-- replace ? placeholders with actual values by Spring Boot
INSERT INTO users(user_id, full_name, email, password_hash) 
VALUES (UUID(), ?, ?, ?);

-- Query 2: find active user by email for login -> called when user taps SIGN IN -> returns user if account is active
SELECT user_id, full_name, email, password_hash
FROM users
WHERE email = ? AND is_active = TRUE;

-- Query 3: Check if email already exists -> called before registering new user to prevent duplicate accounts
SELECT COUNT(*) AS email_count 
FROM users
WHERE email = ?;

-- Query 4: Get user profile -> called to display user profile information and it never returns password hash to frontend
SELECT user_id, full_name, email, is_active, created_at
FROM users
WHERE user_id = ? AND is_active = TRUE;

-- Query 5: Update full name -> called when user updates their profile
UPDATE users
SET full_name = ?
WHERE user_id = ? AND is_active = TRUE;

-- Query 6: Update email -> called when user updates their profile
UPDATE users
SET email = ?
WHERE user_id = ? AND is_active = TRUE;

-- Query 7: Update password -> called when user updates their profile -> new password_hash must be Bcrypt hashed already
UPDATE users
SET password_hash = ?
WHERE user_id = ? AND is_active = TRUE;

-- Query 8: Deactivate account -> called when user deactivates their account ->  (soft delete by setting is_active to FALSE and recording deactivation timestamp)
UPDATE users
SET is_active = FALSE, deactivated_at = CURRENT_TIMESTAMP
WHERE user_id = ? AND is_active = TRUE;

-- Query 10: Save push token. Its called when user grants notification permission on their device
-- Expo generates a unique push token per device
-- Stored so Spring Boot can send notifications to this user
UPDATE users
SET push_token = ?
WHERE user_id = ?
AND is_active = TRUE;

-- Query 11: Get push token for user. Its called by Spring Boot when sending notification to companion
SELECT push_token
FROM users
WHERE user_id = ?
AND is_active = TRUE
AND push_token IS NOT NULL;