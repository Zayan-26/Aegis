CREATE DATABASE IF NOT EXISTS aegis; --create database if it doesn't exist
USE aegis;

DROP TABLE IF EXISTS users;
/*User table
  1. Stores all user accounts created via email and password
  2. Soft delete supported using is_active and deactivated_at*/

CREATE TABLE users (user_id CHAR(36) NOT NULL,
                    full_name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    deactivated_at TIMESTAMP NULL,
                    
-- Primary key 
	constraint pk_users primary key (user_id),
-- Unique constraints
	constraint uq_users_email unique (email),
-- Check constraintsusers
	constraint chk_users_email check (email LIKE '%_@_%.__%'),
	constraint chk_users_full_name check (length(full_name) >= 2),
  constraint chk_users_password check (length(password_hash) >= 60),
  constraint chk_users_deactivated check (deactivated_at IS NULL or deactivated_at >= created_at)
);

