CREATE TABLE accessibility_prefs( pref_id CHAR(36) NOT NULL,
								                  user_id CHAR(36) NOT NULL,
                                  dyslexia_support BOOLEAN NOT NULL DEFAULT FALSE,
                                  colour_blind_friendly BOOLEAN NOT NULL DEFAULT FALSE,
                                  high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
                                  large_touch_buttons BOOLEAN NOT NULL DEFAULT FALSE,
                                  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Primary key
  CONSTRAINT pk_accessibility_prefs 
  PRIMARY KEY (pref_id),
-- one user with one preferences record
  CONSTRAINT uq_accessibility_prefs_user 
  UNIQUE (user_id),
-- Foreign key
  CONSTRAINT fk_accessibility_prefs_user 
  FOREIGN KEY (user_id) 
  REFERENCES users(user_id)
  ON DELETE CASCADE	-- for soft delete
);


-- describe accessibility_prefs; to view the table