USE aegis;

INSERT INTO feedback 
(feedback_id, user_id, route_id, rating, feedback_text, would_recommend, created_at) 
VALUES
-- Mahima: 5 stars, text, recommends
('g1b2c3d4-0001-0001-0001-000000000001',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'c1b2c3d4-0001-0001-0001-000000000001',
 5,
 'Route felt very safe, well lit all the way',
 TRUE,
 '2026-03-15 22:55:00'),

-- Sara: 4 stars, no text, recommends
('g1b2c3d4-0002-0002-0002-000000000002',
 'a1b2c3d4-0002-0002-0002-000000000002',
 'c1b2c3d4-0003-0003-0003-000000000003',
 4,
 NULL,
 TRUE,
 '2026-03-16 14:45:00'),

-- Mahima: 3 stars, with concern, does not recommend
('g1b2c3d4-0003-0003-0003-000000000003',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'c1b2c3d4-0004-0004-0004-000000000004',
 3,
 'Some sections felt dark near the park',
 FALSE,
 '2026-03-17 23:25:00');

-- Select * from feedback;