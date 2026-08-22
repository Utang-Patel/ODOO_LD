-- ==========================================
-- GlobeTrotter Database Schema Definition
-- Target DBMS: MySQL
-- ==========================================

CREATE DATABASE IF NOT EXISTS globetrotter_db;
USE globetrotter_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    photo_url VARCHAR(255) NULL,
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Cities Table (Destinations)
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    cost_index VARCHAR(5) NOT NULL DEFAULT '$$', -- $, $$, $$$
    popularity INT DEFAULT 1, -- Rating/Popularity scale (e.g. 1-5)
    image_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Activities Table (Predefined/Selectable Things to Do)
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'sightseeing', -- sightseeing, food, adventure, shopping, culture
    cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    duration_minutes INT NOT NULL DEFAULT 60,
    image_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- 4. Trips Table (User Trip Metainfo)
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_photo VARCHAR(255) NULL,
    total_budget DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Trip Stops Table (Destinations added to a specific Trip)
CREATE TABLE IF NOT EXISTS trip_stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    city_id INT NOT NULL,
    arrival_date DATE NULL,
    departure_date DATE NULL,
    sequence_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- 6. Itinerary Activities Table (Actual scheduled items per day/stop)
CREATE TABLE IF NOT EXISTS itinerary_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    trip_stop_id INT NOT NULL,
    activity_id INT NULL, -- NULL if user writes a custom activity not in the standard list
    custom_name VARCHAR(150) NULL, -- Fallback when activity_id is NULL
    custom_cost DECIMAL(10, 2) NULL, -- Fallback / Overridden cost
    activity_date DATE NOT NULL,
    start_time TIME NULL,
    sequence_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL
);

-- 7. Trip Budgets Table (Direct/Other costs, categorized breakdown)
CREATE TABLE IF NOT EXISTS trip_budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    category ENUM('transport', 'stay', 'activities', 'meals', 'other') NOT NULL DEFAULT 'other',
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    expense_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 8. Saved Destinations Table (User wishlist/favorites)
CREATE TABLE IF NOT EXISTS saved_destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    city_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_city (user_id, city_id)
);

-- ==========================================
-- Seeding Sample Data
-- ==========================================

-- Seed Cities
INSERT INTO cities (id, name, country, cost_index, popularity, image_url) VALUES
(1, 'Paris', 'France', '$$$', 5, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'),
(2, 'Tokyo', 'Japan', '$$$', 5, 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7'),
(3, 'Rome', 'Italy', '$$', 4, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5'),
(4, 'Bali', 'Indonesia', '$', 4, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4'),
(5, 'New York', 'United States', '$$$', 5, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9');

-- Seed Activities
INSERT INTO activities (city_id, name, description, type, cost, duration_minutes, image_url) VALUES
-- Paris
(1, 'Eiffel Tower Visit', 'Experience stunning panoramic views of Paris.', 'sightseeing', 45.00, 120, 'https://images.unsplash.com/photo-1431274172761-fca41d930114'),
(1, 'Louvre Museum Tour', 'See masterpieces like the Mona Lisa and Venus de Milo.', 'culture', 22.00, 180, 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c'),
(1, 'Seine River Cruise', 'Relaxing boat cruise along the historic Seine River.', 'sightseeing', 15.00, 60, 'https://images.unsplash.com/photo-1509840841025-9088ba78a826'),
-- Tokyo
(2, 'Shibuya Crossing Walk', 'Walk through the famous, busiest pedestrian intersection.', 'sightseeing', 0.00, 30, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26'),
(2, 'Sushi Making Masterclass', 'Learn to prepare traditional sushi from a local chef.', 'food', 75.00, 150, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'),
(2, 'Senso-ji Temple Tour', 'Visit Tokyos oldest and most significant Buddhist temple.', 'culture', 0.00, 90, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'),
-- Rome
(3, 'Colosseum Guided Tour', 'Walk through the grand ruins of ancient Rome.', 'sightseeing', 35.00, 150, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5'),
(3, 'Vatican Museums & Sistine Chapel', 'Explore priceless Vatican treasures and Michelangelo\'s ceiling.', 'culture', 30.00, 180, 'https://images.unsplash.com/photo-1531572753322-ad063cecc140'),
(3, 'Pasta & Gelato Making', 'Handcraft authentic Italian pasta and fresh gelato.', 'food', 60.00, 120, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141'),
-- Bali
(4, 'Tegallalang Rice Terraces', 'Walk across the breathtaking valley of rice paddies.', 'sightseeing', 5.00, 90, 'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c'),
(4, 'Scuba Diving in Tulamben', 'Explore the USAT Liberty Shipwreck beneath the waves.', 'adventure', 90.00, 240, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'),
(4, 'Ubud Monkey Forest Walk', 'See playful macaques in their natural jungle sanctuary.', 'sightseeing', 6.00, 60, 'https://images.unsplash.com/photo-1518548419070-2c51169650d4'),
-- New York
(5, 'Empire State Building Observatory', 'Breathtaking 360-degree views of the NYC skyline.', 'sightseeing', 42.00, 90, 'https://images.unsplash.com/photo-1502104034360-73176bb1e92e'),
(5, 'Broadway Show ticket', 'Enjoy a world-class musical or play in Manhattan.', 'culture', 120.00, 150, 'https://images.unsplash.com/photo-1513151233558-d860c5398176'),
(5, 'Central Park Bike Tour', 'Cycle through the iconic landmarks of Central Park.', 'adventure', 25.00, 120, 'https://images.unsplash.com/photo-1485871981521-5b1fd36d099a');
