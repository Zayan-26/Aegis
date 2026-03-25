USE aegis;

-- Test 1: Submit valid feedback with text
INSERT INTO feedback
(feedback_id, user_id, route_id, rating, feedback_text, would_recommend)
VALUES (
    UUID(),
    'a1b2c3d4-0006-0006-0006-000000000006',
    'c1b2c3d4-0002-0002-0002-000000000002',
     4, 'Good route overall', TRUE
);
-- Expected: 1 row inserted
SELECT * FROM feedback
WHERE user_id = 'a1b2c3d4-0006-0006-0006-000000000006';

-- Test 2: Submit feedback without text
INSERT INTO feedback
(feedback_id, user_id, route_id, rating, feedback_text, would_recommend)
VALUES (
    UUID(),
    'a1b2c3d4-0005-0005-0005-000000000005',
    'c1b2c3d4-0003-0003-0003-000000000003',
     5, NULL, TRUE
);
-- Expected: 1 row inserted — NULL text is fine
SELECT rating, feedback_text, would_recommend FROM feedback
WHERE user_id = 'a1b2c3d4-0005-0005-0005-000000000005';

-- Test 3: Try submitting duplicate feedback
INSERT INTO feedback
(feedback_id, user_id, route_id, rating, feedback_text, would_recommend)
VALUES (
    UUID(),
    'a1b2c3d4-0001-0001-0001-000000000001',
    'c1b2c3d4-0001-0001-0001-000000000001',
     2, 'Trying to submit again', FALSE
);
-- Expected: ERROR — violates uq_feedback

-- Test 4: Try rating = 0
INSERT INTO feedback
(feedback_id, user_id, route_id, rating, feedback_text, would_recommend)
VALUES (
    UUID(),
    'a1b2c3d4-0004-0004-0004-000000000004',
    'c1b2c3d4-0002-0002-0002-000000000002',
     0, NULL, TRUE
);
-- Expected: ERROR — violates chk_feedback_rating

-- Test 5: Try rating = 6
INSERT INTO feedback
(feedback_id, user_id, route_id, rating, feedback_text, would_recommend)
VALUES (
    UUID(),
    'a1b2c3d4-0004-0004-0004-000000000004',
    'c1b2c3d4-0002-0002-0002-000000000002',
     6, NULL, TRUE
);
-- Expected: ERROR — violates chk_feedback_rating

-- Test 6: Check already submitted
SELECT COUNT(*) AS already_submitted
FROM feedback
WHERE user_id = 'a1b2c3d4-0001-0001-0001-000000000001'
AND route_id = 'c1b2c3d4-0001-0001-0001-000000000001';
-- Expected: 1

-- Test 7: Get feedback for Selly Oak route
SELECT u.full_name, f.rating, f.feedback_text,
       f.would_recommend, f.created_at
FROM feedback f
JOIN users u ON f.user_id = u.user_id
WHERE f.route_id = 'c1b2c3d4-0001-0001-0001-000000000001'
ORDER BY f.created_at DESC;
-- Expected: Mahima 5 star review

-- Test 8: Analytics
SELECT
    ROUND(AVG(rating), 2) AS average_rating,
    COUNT(*) AS total_reviews,
    ROUND(SUM(would_recommend) / COUNT(*) * 100, 1) AS recommend_percentage
FROM feedback;
-- Expected: Average around 4.0, recommendation percentage shown

-- CLEANUP
SET SQL_SAFE_UPDATES = 0;
DELETE FROM feedback
WHERE user_id IN (
    'a1b2c3d4-0006-0006-0006-000000000006',
    'a1b2c3d4-0005-0005-0005-000000000005'
);
SET SQL_SAFE_UPDATES = 1;