-- ============================================================
-- GlobeTrotter Database Schema Definition
-- Target DBMS: MySQL (v8.0+)
-- Database: globetrotter_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS globetrotter_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE globetrotter_db;

-- Disable foreign key checks for clean table initialization
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS saved_destinations;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS itinerary_items;
DROP TABLE IF EXISTS trip_stops;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. Users Table
-- Stores user accounts and administrative roles
-- ============================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    profile_image VARCHAR(500) NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Cities Table
-- Stores destination cities and country information
-- ============================================================
CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NULL,
    description TEXT NULL,
    image VARCHAR(500) NULL,
    cost_index DECIMAL(5,2) NULL,
    popularity DECIMAL(5,2) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_city_country (name, country),
    INDEX idx_cities_region (region),
    INDEX idx_cities_popularity (popularity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Trips Table
-- Stores user travel trips and sharing metadata
-- ============================================================
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_image VARCHAR(500) NULL,
    budget_limit DECIMAL(12,2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    share_token VARCHAR(255) NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_trips_user_id (user_id),
    INDEX idx_trips_start_date (start_date),
    INDEX idx_trips_end_date (end_date),
    INDEX idx_trips_is_public (is_public),
    INDEX idx_trips_share_token (share_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. Activities Table
-- Stores tourist activities associated with cities
-- ============================================================
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NULL,
    image VARCHAR(500) NULL,
    cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    duration DECIMAL(5,2) NULL,
    rating DECIMAL(3,2) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    INDEX idx_activities_city_id (city_id),
    INDEX idx_activities_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. Trip Stops Table
-- Stores city stops connected to a trip itinerary
-- ============================================================
CREATE TABLE trip_stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    city_id INT NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    stop_order INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    INDEX idx_trip_stops_trip_id (trip_id),
    INDEX idx_trip_stops_city_id (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. Itinerary Items Table
-- Stores activities scheduled inside specific trip stops
-- ============================================================
CREATE TABLE itinerary_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    trip_stop_id INT NOT NULL,
    activity_id INT NOT NULL,
    activity_date DATE NOT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    notes TEXT NULL,
    item_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    INDEX idx_itinerary_trip_id (trip_id),
    INDEX idx_itinerary_stop_id (trip_stop_id),
    INDEX idx_itinerary_activity_id (activity_id),
    INDEX idx_itinerary_activity_date (activity_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. Expenses Table
-- Stores financial expenses logged for a trip
-- ============================================================
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    category ENUM('Transport', 'Accommodation', 'Activities', 'Meals') NOT NULL,
    description VARCHAR(255) NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    expense_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_expenses_trip_id (trip_id),
    INDEX idx_expenses_category (category),
    INDEX idx_expenses_expense_date (expense_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. Saved Destinations Table
-- Stores user favorite saved cities (Heart Toggle)
-- ============================================================
CREATE TABLE saved_destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    city_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_city (user_id, city_id),
    INDEX idx_saved_user_id (user_id),
    INDEX idx_saved_city_id (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
