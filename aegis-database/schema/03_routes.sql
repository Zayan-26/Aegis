USE aegis;

DROP TABLE IF EXISTS routes;

CREATE TABLE routes (
    route_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    destination_name VARCHAR(255) NOT NULL,
    origin_lat DECIMAL(9,6) NOT NULL,
    origin_lng DECIMAL(9,6) NOT NULL,
    destination_lat DECIMAL(9,6) NOT NULL,
    destination_lng DECIMAL(9,6) NOT NULL,
    route_type ENUM('SAFEST','FASTEST') NOT NULL,
    safety_score DECIMAL(5,2) NULL,
    distance_km DECIMAL(6,2) NOT NULL,
    duration_minutes INT NOT NULL,
    route_coordinates JSON NOT NULL,
    is_saved BOOLEAN NOT NULL DEFAULT FALSE,
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_routes
        PRIMARY KEY (route_id),

    CONSTRAINT fk_routes_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_routes_safety_score
        CHECK (safety_score IS NULL OR safety_score BETWEEN 0 AND 100),

    CONSTRAINT chk_routes_distance
        CHECK (distance_km > 0),

    CONSTRAINT chk_routes_duration
        CHECK (duration_minutes > 0),

    CONSTRAINT chk_routes_origin_lat
        CHECK (origin_lat BETWEEN -90 AND 90),

    CONSTRAINT chk_routes_origin_lng
        CHECK (origin_lng BETWEEN -180 AND 180),

    CONSTRAINT chk_routes_dest_lat
        CHECK (destination_lat BETWEEN -90 AND 90),

    CONSTRAINT chk_routes_dest_lng
        CHECK (destination_lng BETWEEN -180 AND 180)
);

CREATE INDEX idx_routes_user     ON routes(user_id);
CREATE INDEX idx_routes_saved    ON routes(user_id, is_saved);
CREATE INDEX idx_routes_time     ON routes(user_id, requested_at);