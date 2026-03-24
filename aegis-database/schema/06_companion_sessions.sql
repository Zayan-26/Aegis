USE aegis;
 
DROP TABLE IF EXISTS companion_sessions;
 
CREATE TABLE companion_sessions (
    session_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    companion_id CHAR(36) NOT NULL,
    route_id CHAR(36) NOT NULL,
    session_code CHAR(6) NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'ENDED') NOT NULL DEFAULT 'PENDING',
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
 
    CONSTRAINT pk_companion_sessions PRIMARY KEY (session_id),
    CONSTRAINT uq_session_code UNIQUE (session_code),
    CONSTRAINT uq_companion_sessions UNIQUE (user_id, companion_id, route_id),
    CONSTRAINT chk_companion_self CHECK (user_id != companion_id),
    CONSTRAINT chk_companion_dates CHECK (ended_at IS NULL OR ended_at >= started_at),
    CONSTRAINT fk_companion_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_companion_companion FOREIGN KEY (companion_id) 
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_companion_route FOREIGN KEY (route_id) 
        REFERENCES routes(route_id) ON DELETE CASCADE);
 
CREATE INDEX idx_companion_sessions_user ON companion_sessions(user_id);
CREATE INDEX idx_companion_sessions_companion ON companion_sessions(companion_id);
CREATE INDEX idx_companion_sessions_active ON companion_sessions(status);