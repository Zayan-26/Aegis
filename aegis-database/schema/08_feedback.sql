USE aegis;

DROP TABLE IF EXISTS feedback;

CREATE TABLE feedback(
	feedback_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    route_id CHAR(36) NOT NULL, 
    rating TINYINT NOT NULL,
    feedback_text VARCHAR(500) NULL,
    would_recommend BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
-- Primary key
CONSTRAINT pk_feedback PRIMARY KEY (feedback_id),
    
-- One feedback per route per user
CONSTRAINT uq_feedback UNIQUE (user_id, route_id),

-- Rating between 1 and 5
CONSTRAINT chk_feedback_rating CHECK (rating BETWEEN 1 AND 5),

-- Foreign keys
CONSTRAINT fk_feedback_user 
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE CASCADE,

CONSTRAINT fk_feedback_route
FOREIGN KEY (route_id)
REFERENCES routes(route_id)
ON DELETE CASCADE
);

CREATE INDEX idx_feedback_user ON feedback(user_id);
CREATE INDEX idx_feedback_route ON feedback(route_id);

DESCRIBE feedback;