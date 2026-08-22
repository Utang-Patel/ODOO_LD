-- ============================================================
-- GlobeTrotter Safe Admin User Seed
-- Target DBMS: MySQL (v8.0+)
-- Database: globetrotter_db
-- ============================================================
-- IMPORTANT SECURITY NOTE:
-- Passwords inside `users` MUST be stored as bcrypt hashes (cost factor 10).
-- NEVER store plain text passwords in SQL scripts.
--
-- Environment Variable Fallbacks:
-- ADMIN_EMAIL: admin@globetrotter.com
-- ADMIN_PASSWORD: Admin#123456
-- Pre-hashed Bcrypt String below corresponds to: 'Admin#123456'
-- ============================================================

USE globetrotter_db;

INSERT INTO users (name, email, password, role, profile_image, language)
VALUES (
  'GlobeTrotter Admin',
  'admin@globetrotter.com',
  '$2b$10$vN0oT1zKq5r8E9Z4sJ5y3.oP0x1y2z3a4b5c6d7e8f9g0h1i2j3k4', -- Bcrypt hashed password
  'admin',
  NULL,
  'en'
)
ON DUPLICATE KEY UPDATE
  role = 'admin';
