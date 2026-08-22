# GlobeTrotter Data Dictionary

Comprehensive technical specification of all tables, fields, data types, constraints, default values, and relational associations for the `globetrotter_db` MySQL database.

---

## 1. Table: `users`
Stores registered traveler accounts and administrative role assignments.

| Field Name | Data Type | Nullable | Key | Default | Description | Relationships |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `id` | `INT` | NO | PK | *Auto Increment* | Unique user primary identifier | Referenced by `trips`, `saved_destinations` |
| `name` | `VARCHAR(100)` | NO | - | None | Full name of the user | - |
| `email` | `VARCHAR(150)` | NO | UNIQUE | None | Unique login email address | - |
| `password` | `VARCHAR(255)` | NO | - | None | Hashed password (bcrypt factor 10) | - |
| `role` | `ENUM('user','admin')` | NO | - | `'user'` | Role authorization level | - |
| `profile_image` | `VARCHAR(500)` | YES | - | `NULL` | Profile avatar image URL | - |
| `language` | `VARCHAR(10)` | NO | - | `'en'` | Preferred interface language (`en`, `hi`, `gu`) | - |
| `created_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Timestamp when user signed up | - |
| `updated_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Timestamp of last profile update | - |

---

## 2. Table: `trips`
Stores multi-city travel itineraries created by users.

| Field Name | Data Type | Nullable | Key | Default | Description | Relationships |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `id` | `INT` | NO | PK | *Auto Increment* | Unique trip primary identifier | Referenced by `trip_stops`, `itinerary_items`, `expenses` |
| `user_id` | `INT` | NO | FK | None | Owner user ID | References `users.id` (CASCADE) |
| `trip_name` | `VARCHAR(150)` | NO | - | None | Title of the trip | - |
| `description` | `TEXT` | YES | - | `NULL` | Detailed trip notes/description | - |
| `start_date` | `DATE` | NO | - | None | Trip starting date | - |
| `end_date` | `DATE` | NO | - | None | Trip ending date | - |
| `cover_image` | `VARCHAR(500)` | YES | - | `NULL` | Trip banner image URL | - |
| `budget_limit` | `DECIMAL(12,2)`| YES | - | `NULL` | Maximum financial budget limit | - |
| `currency` | `VARCHAR(10)` | NO | - | `'INR'` | Currency code (INR, EUR, USD, etc.) | - |
| `is_public` | `BOOLEAN` | NO | - | `FALSE` | Public link sharing status | - |
| `share_token` | `VARCHAR(255)` | YES | UNIQUE | `NULL` | Cryptographic 16-byte random hex share token | - |
| `created_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Trip creation timestamp | - |
| `updated_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Last modification timestamp | - |

---

## 3. Table: `cities`
Master repository of global destination cities.

| Field Name | Data Type | Nullable | Key | Default | Description | Relationships |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `id` | `INT` | NO | PK | *Auto Increment* | Unique city primary identifier | Referenced by `activities`, `trip_stops`, `saved_destinations` |
| `name` | `VARCHAR(100)` | NO | - | None | Name of the city | Unique composite key `(name, country)` |
| `country` | `VARCHAR(100)` | NO | - | None | Country where city is located | - |
| `region` | `VARCHAR(100)` | YES | - | `NULL` | Geographic region (Europe, Asia, etc.) | - |
| `description` | `TEXT` | YES | - | `NULL` | Overview description of destination | - |
| `image` | `VARCHAR(500)` | YES | - | `NULL` | High-resolution city image URL | - |
| `cost_index` | `DECIMAL(5,2)` | YES | - | `NULL` | Relative cost index tier | - |
| `popularity` | `DECIMAL(5,2)` | YES | - | `NULL` | Popularity rating (1 to 5) | - |
| `created_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Record insertion timestamp | - |
| `updated_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Record update timestamp | - |

---

## 4. Table: `activities`
Master repository of tourist attractions and activities.

| Field Name | Data Type | Nullable | Key | Default | Description | Relationships |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `id` | `INT` | NO | PK | *Auto Increment* | Unique activity primary identifier | Referenced by `itinerary_items` |
| `city_id` | `INT` | NO | FK | None | Associated city ID | References `cities.id` (CASCADE) |
| `name` | `VARCHAR(150)` | NO | - | None | Title of attraction/activity | - |
| `category` | `VARCHAR(100)` | NO | - | None | Category (`Sightseeing`, `Culture`, `Food`, `Adventure`, `Nature`, `Shopping`) | - |
| `description` | `TEXT` | YES | - | `NULL` | Detailed activity description | - |
| `image` | `VARCHAR(500)` | YES | - | `NULL` | Activity banner image URL | - |
| `cost` | `DECIMAL(12,2)`| NO | - | `0.00` | Estimated cost per person | - |
| `duration` | `DECIMAL(5,2)` | YES | - | `NULL` | Estimated duration in hours | - |
| `rating` | `DECIMAL(3,2)` | YES | - | `NULL` | User rating (0.0 to 5.0) | - |
| `created_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Record creation timestamp | - |
| `updated_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Record update timestamp | - |

---

## 5. Table: `trip_stops`
Stores city stops attached to a user trip.

| Field Name | Data Type | Nullable | Key | Default | Description | Relationships |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `id` | `INT` | NO | PK | *Auto Increment* | Unique stop primary identifier | Referenced by `itinerary_items` |
| `trip_id` | `INT` | NO | FK | None | Parent trip ID | References `trips.id` (CASCADE) |
| `city_id` | `INT` | NO | FK | None | Stop destination city ID | References `cities.id` (CASCADE) |
| `arrival_date` | `DATE` | NO | - | None | Arrival date at destination | - |
| `departure_date`| `DATE` | NO | - | None | Departure date from destination | - |
| `stop_order` | `INT` | NO | - | None | Sequential order of stop in trip | - |
| `created_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Creation timestamp | - |
| `updated_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Update timestamp | - |

---

## 6. Table: `itinerary_items`
Stores scheduled activities on city stops inside a trip.

| Field Name | Data Type | Nullable | Key | Default | Description | Relationships |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `id` | `INT` | NO | PK | *Auto Increment* | Unique scheduled item ID | - |
| `trip_id` | `INT` | NO | FK | None | Parent trip ID | References `trips.id` (CASCADE) |
| `trip_stop_id` | `INT` | NO | FK | None | Parent trip stop ID | References `trip_stops.id` (CASCADE) |
| `activity_id` | `INT` | NO | FK | None | Scheduled activity ID | References `activities.id` (CASCADE) |
| `activity_date` | `DATE` | NO | - | None | Date activity is scheduled for | - |
| `start_time` | `TIME` | YES | - | `NULL` | Start time slot | - |
| `end_time` | `TIME` | YES | - | `NULL` | End time slot | - |
| `notes` | `TEXT` | YES | - | `NULL` | User notes for scheduled item | - |
| `item_order` | `INT` | NO | - | `0` | Sequence order within day | - |
| `created_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Creation timestamp | - |
| `updated_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Update timestamp | - |

---

## 7. Table: `expenses`
Stores financial expenses logged for a trip.

| Field Name | Data Type | Nullable | Key | Default | Description | Relationships |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `id` | `INT` | NO | PK | *Auto Increment* | Unique expense ID | - |
| `trip_id` | `INT` | NO | FK | None | Parent trip ID | References `trips.id` (CASCADE) |
| `category` | `ENUM` | NO | - | None | Category (`Transport`, `Accommodation`, `Activities`, `Meals`) | - |
| `description` | `VARCHAR(255)`| YES | - | `NULL` | Expense line description | - |
| `amount` | `DECIMAL(12,2)`| NO | - | None | Financial expense amount (Must be > 0) | - |
| `currency` | `VARCHAR(10)` | NO | - | `'INR'` | Expense currency code | - |
| `expense_date` | `DATE` | NO | - | None | Date expense was incurred | - |
| `created_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Creation timestamp | - |
| `updated_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Update timestamp | - |

---

## 8. Table: `saved_destinations`
Stores user saved favorite cities (Heart Toggle).

| Field Name | Data Type | Nullable | Key | Default | Description | Relationships |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `id` | `INT` | NO | PK | *Auto Increment* | Unique saved record ID | - |
| `user_id` | `INT` | NO | FK | None | User ID | References `users.id` (CASCADE) |
| `city_id` | `INT` | NO | FK | None | Saved city ID | References `cities.id` (CASCADE) |
| `created_at` | `DATETIME` | NO | - | `CURRENT_TIMESTAMP` | Creation timestamp | Unique composite key `(user_id, city_id)` |
