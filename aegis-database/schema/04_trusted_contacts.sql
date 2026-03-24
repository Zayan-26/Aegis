USE aegis;

DROP TABLE IF EXISTS trusted_contacts;

CREATE TABLE trusted_contacts (
    contact_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    contact_user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Primary key
    CONSTRAINT pk_trusted_contacts
        PRIMARY KEY (contact_id),

    -- Prevent duplicate relationships that is the same user cannot add same contact twice.
    CONSTRAINT uq_trusted_contacts
        UNIQUE (user_id, contact_user_id),

    -- the user cannot add themselves as a trusted contact
    CONSTRAINT chk_trusted_contacts_self
        CHECK (user_id != contact_user_id),

    -- Foreign keys
    CONSTRAINT fk_trusted_contacts_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_trusted_contacts_contact
        FOREIGN KEY (contact_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_trusted_contacts_user
    ON trusted_contacts(user_id);

CREATE INDEX idx_trusted_contacts_contact
    ON trusted_contacts(contact_user_id);
