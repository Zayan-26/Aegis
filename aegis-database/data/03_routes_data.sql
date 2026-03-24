USE aegis;

INSERT INTO routes (route_id, user_id, destination_name, origin_lat, origin_lng, destination_lat, destination_lng, route_type, safety_score, distance_km, duration_minutes, route_coordinates, is_saved, requested_at) VALUES

-- Mahima's safest route to Selly Oak
('c1b2c3d4-0001-0001-0001-000000000001',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'Selly Oak',
 52.451870, -1.930796,
 52.440136, -1.939288,
 'SAFEST',
 92.00,
 1.80, 24,
 '[{"lat":52.451870,"lng":-1.930796},{"lat":52.448500,"lng":-1.933200},{"lat":52.445200,"lng":-1.935800},{"lat":52.442100,"lng":-1.937900},{"lat":52.440136,"lng":-1.939288}]',
 TRUE,
 '2026-03-15 22:30:00'),

-- Mahima's fastest route to Selly Oak
('c1b2c3d4-0002-0002-0002-000000000002',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'Selly Oak',
 52.451870, -1.930796,
 52.440136, -1.939288,
 'FASTEST',
 NULL,
 1.20, 17,
 '[{"lat":52.451870,"lng":-1.930796},{"lat":52.446000,"lng":-1.935000},{"lat":52.440136,"lng":-1.939288}]',
 FALSE,
 '2026-03-15 22:30:00'),

-- Sara's safest route - daytime journey
('c1b2c3d4-0003-0003-0003-000000000003',
 'a1b2c3d4-0002-0002-0002-000000000002',
 'Birmingham City Centre',
 52.440136, -1.939288,
 52.479699, -1.902660,
 'SAFEST',
 85.00,
 3.20, 42,
 '[{"lat":52.440136,"lng":-1.939288},{"lat":52.452000,"lng":-1.930000},{"lat":52.465000,"lng":-1.918000},{"lat":52.479699,"lng":-1.902660}]',
 FALSE,
 '2026-03-16 14:00:00'),

-- Mahima's second journey - saved
('c1b2c3d4-0004-0004-0004-000000000004',
 'a1b2c3d4-0001-0001-0001-000000000001',
 'University of Birmingham',
 52.440136, -1.939288,
 52.450819, -1.930420,
 'SAFEST',
 78.00,
 1.50, 21,
 '[{"lat":52.440136,"lng":-1.939288},{"lat":52.444000,"lng":-1.936000},{"lat":52.448000,"lng":-1.932000},{"lat":52.450819,"lng":-1.930420}]',
 TRUE,
 '2026-03-17 23:00:00');
 
 SELECT * FROM routes;