# GlobeTrotter Database Migration History

This directory documents the evolutionary schema versions for the `globetrotter_db` MySQL database.

---

## 📜 Migration Log

### `001_initial_schema` (Phase 2)
- Created base tables: `users` and `trips`.
- Configured user JWT authentication and bcrypt password hashing.

### `002_add_city_and_activity_discovery` (Phase 5)
- Created discovery tables: `cities` and `activities`.
- Created travel stop and scheduling tables: `trip_stops` and `itinerary_items`.
- Configured foreign key relationships with `ON DELETE CASCADE`.

### `003_add_budget_and_expenses` (Phase 6)
- Added financial columns to `trips`: `budget_limit` (DECIMAL) and `currency` (VARCHAR).
- Created financial log table: `expenses` (`id`, `trip_id`, `category`, `description`, `amount`, `currency`, `expense_date`).

### `004_add_sharing_and_saved_destinations` (Phase 7)
- Added public sharing fields to `trips`: `is_public` (BOOLEAN) and `share_token` (VARCHAR 16-byte hex, UNIQUE).
- Added user profile fields to `users`: `profile_image` and `language`.
- Created saved destinations table: `saved_destinations` with composite unique index `(user_id, city_id)`.

### `005_add_user_roles_and_admin_analytics` (Phase 8)
- Added role-based access control to `users`: `role` ENUM (`'user'`, `'admin'`), defaulting to `'user'`.
- Created indexes for administrative statistical queries.

---

## 🔒 Safe Migration Guidelines
1. **Never use destructive resets** (`sequelize.sync({ force: true })` or `DROP DATABASE`).
2. Always use non-destructive column additions (`ALTER TABLE` or `sequelize.sync({ alter: true })`).
3. Maintain foreign key integrity and indexes on foreign key columns.
