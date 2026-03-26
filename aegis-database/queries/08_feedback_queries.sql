USE aegis;

-- Query 1: Submit feedback. Its called when user taps Submit on feedback screen
-- UNIQUE constraint prevents submitting twice for same route
INSERT INTO feedback 
(feedback_id, user_id, route_id, rating, feedback_text, would_recommend)
VALUES (UUID(), ?, ?, ?, ?, ?);

-- Query 2: Check if user already submitted feedback. Its called before showing feedback screen
-- If already submitted show existing rating instead of empty form
SELECT COUNT(*) AS already_submitted
FROM feedback
WHERE user_id = ?
AND route_id = ?;

-- Query 3: Get feedback for a specific route. Its called by admin to see what users thought about a route
SELECT u.full_name, f.rating, f.feedback_text,
       f.would_recommend, f.created_at
FROM feedback f
JOIN users u ON f.user_id = u.user_id
WHERE f.route_id = ?
ORDER BY f.created_at DESC;

-- Query 4: Get all feedback by a user. Its called to show user their own feedback history
SELECT f.rating, f.feedback_text, f.would_recommend,
       r.destination_name, f.created_at
FROM feedback f
JOIN routes r ON f.route_id = r.route_id
WHERE f.user_id = ?
ORDER BY f.created_at DESC;

-- Query 5: Analytics — overall rating breakdown. It shows average rating and recommendation percentage
SELECT
    ROUND(AVG(rating), 2) AS average_rating,
    COUNT(*) AS total_reviews,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star,
    ROUND(SUM(would_recommend) / COUNT(*) * 100, 1) AS recommend_percentage
FROM feedback;