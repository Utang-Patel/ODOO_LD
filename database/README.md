# GlobeTrotter Database (`globetrotter_db`)

This directory contains the production DDL schema scripts, master seed files, migration logs, backup configurations, and technical data dictionary for the **GlobeTrotter** MySQL database.

---

## 🗄️ Database Architecture Overview

The database uses MySQL 8.0+ and consists of 8 core tables:

1. **`users`**: Traveler and administrator accounts with bcrypt password hashes and role access control (`user` vs `admin`).
2. **`cities`**: Master repository of global destinations filtered by region and cost index.
3. **`trips`**: Multi-city trip itineraries created by travelers, featuring budget limits and cryptographic share tokens.
4. **`activities`**: Attractions and tourist activities linked to cities.
5. **`trip_stops`**: Ordered city stops connected to a trip itinerary.
6. **`itinerary_items`**: Scheduled activities on city stops with date and time slots.
7. **`expenses`**: Financial expense entries across `Transport`, `Accommodation`, `Activities`, and `Meals`.
8. **`saved_destinations`**: Saved user favorite cities with unique constraints on `[user_id, city_id]`.

---

## 🚀 Setup & Execution Order

### Method 1: Automated Node.js Initialization (Recommended)
The Express backend automatically verifies and synchronizes the MySQL schema on startup:
```bash
cd ../backend
npm run dev
```

### Method 2: Manual SQL Script Execution
If setting up the MySQL database manually via Command Line or MySQL Workbench, execute the scripts in the following order:

```bash
# 1. Create Database & DDL Tables
mysql -u root -p < schema/schema.sql

# 2. Seed Master Cities
mysql -u root -p globetrotter_db < seeds/cities.sql

# 3. Seed Master Activities
mysql -u root -p globetrotter_db < seeds/activities.sql

# 4. Seed Default Admin User
mysql -u root -p globetrotter_db < seeds/admin.sql
```

---

## 🔒 Security & Backup Instructions

### Passwords & Secrets
- Passwords in the `users` table are **never stored in plain text**. All passwords must be hashed using `bcrypt` (cost factor 10).
- Real production database credentials and JWT secrets must be stored strictly inside `backend/.env`.

### Local Database Backups
To create a local dump of your database:
```bash
mysqldump -u root -p globetrotter_db > backups/globetrotter_backup_$(date +%Y%m%d).sql
```
*Note: Real `.sql` dumps placed inside `database/backups/` are automatically ignored by `.gitignore`.*

---

## 📖 Data Dictionary Reference

For a complete breakdown of every column, data type, default value, and foreign key relationship, refer to the [GlobeTrotter Data Dictionary](file:///d:/Globetrotter/database/data_dictionary/data_dictionary.md).
