USE aegis;

DROP TABLE IF EXISTS location_updates;

CREATE TABLE location_updates (
    update_id CHAR(36) NOT NULL,
    session_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    lat DECIMAL(9,6) NOT NULL,
    lng DECIMAL(9,6) NOT NULL,
    accuracy DECIMAL(6,2) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

-- Primary key
CONSTRAINT pk_location_updates
PRIMARY KEY (update_id),

-- Valid coordinate ranges
CONSTRAINT chk_location_lat
CHECK (lat BETWEEN -90 AND 90),

CONSTRAINT chk_location_lng
CHECK (lng BETWEEN -180 AND 180),

-- Accuracy must be positive
CONSTRAINT chk_location_accuracy
CHECK (accuracy > 0),

-- Foreign keys
CONSTRAINT fk_location_session
FOREIGN KEY (session_id)
REFERENCES companion_sessions(session_id)
ON DELETE CASCADE,

CONSTRAINT fk_location_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE CASCADE
);

CREATE INDEX idx_location_session
ON location_updates(session_id);

CREATE INDEX idx_location_time
ON location_updates(session_id, recorded_at);