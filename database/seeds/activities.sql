-- ============================================================
-- GlobeTrotter Master Activity Seeds
-- Target DBMS: MySQL (v8.0+)
-- Database: globetrotter_db
-- ============================================================

USE globetrotter_db;

-- Insert Activities referencing City IDs
INSERT INTO activities (city_id, name, category, description, image, cost, duration, rating)
SELECT c.id, 'Eiffel Tower Sightseeing', 'Sightseeing', 'Ascend Paris iconic iron tower for panoramic city views.', 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80', 28.00, 2.50, 4.90 FROM cities c WHERE c.name = 'Paris'
UNION ALL
SELECT c.id, 'Louvre Museum Tour', 'Culture', 'Explore Mona Lisa and thousands of world-famous artworks.', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', 22.00, 3.50, 4.80 FROM cities c WHERE c.name = 'Paris'
UNION ALL
SELECT c.id, 'Sunset Seine River Cruise', 'Sightseeing', 'Glide past Notre-Dame and illuminated Parisian bridges.', 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80', 18.00, 1.50, 4.70 FROM cities c WHERE c.name = 'Paris'
UNION ALL
SELECT c.id, 'Montmartre & Sacré-Cœur Walk', 'Culture', 'Stroll through bohemian artist alleys and admire cathedral views.', 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&w=800&q=80', 0.00, 2.00, 4.80 FROM cities c WHERE c.name = 'Paris'
UNION ALL
SELECT c.id, 'French Bistro Gourmet Dinner', 'Food', 'Sample traditional duck confit, escargot, and French pastries.', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80', 45.00, 2.00, 4.90 FROM cities c WHERE c.name = 'Paris'
UNION ALL
SELECT c.id, 'Shibuya Crossing & Hachiko Statue', 'Sightseeing', 'Experience the world busiest pedestrian crossing.', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80', 0.00, 1.00, 4.80 FROM cities c WHERE c.name = 'Tokyo'
UNION ALL
SELECT c.id, 'Senso-ji Temple Walk', 'Culture', 'Visit Tokyo oldest and most famous Buddhist temple in Asakusa.', 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80', 0.00, 2.00, 4.90 FROM cities c WHERE c.name = 'Tokyo'
UNION ALL
SELECT c.id, 'Tokyo Skytree Observatory', 'Sightseeing', 'Enjoy 360-degree views of Tokyo skyline and Mount Fuji.', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80', 25.00, 2.00, 4.70 FROM cities c WHERE c.name = 'Tokyo'
UNION ALL
SELECT c.id, 'Tsukiji Outer Market Food Tasting', 'Food', 'Savor fresh sushi, tamagoyaki, and wagyu skewers.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80', 35.00, 2.00, 4.90 FROM cities c WHERE c.name = 'Tokyo'
UNION ALL
SELECT c.id, 'Akihabara Tech & Anime Exploration', 'Shopping', 'Explore electric town retro gaming shops and maid cafes.', 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80', 0.00, 3.00, 4.60 FROM cities c WHERE c.name = 'Tokyo'
UNION ALL
SELECT c.id, 'Burj Khalifa Observation Deck', 'Sightseeing', 'Stand atop the world tallest building on Level 124 & 125.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', 45.00, 2.00, 4.90 FROM cities c WHERE c.name = 'Dubai'
UNION ALL
SELECT c.id, 'Desert Safari & BBQ Dinner', 'Adventure', 'Dune bashing, camel riding, henna painting, and belly dancing.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', 65.00, 6.00, 4.80 FROM cities c WHERE c.name = 'Dubai'
UNION ALL
SELECT c.id, 'Ubud Tegallalang Rice Terraces', 'Nature', 'Walk through emerald green stepped fields and giant swings.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', 5.00, 2.00, 4.90 FROM cities c WHERE c.name = 'Bali'
UNION ALL
SELECT c.id, 'Lake Zurich Boat Excursion', 'Sightseeing', 'Scenic boat cruise across pristine alpine waters.', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80', 25.00, 2.00, 4.80 FROM cities c WHERE c.name = 'Zurich'
UNION ALL
SELECT c.id, 'Colosseum & Roman Forum Tour', 'Sightseeing', 'Walk through ancient gladiatorial arenas and ruins.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', 24.00, 3.00, 4.90 FROM cities c WHERE c.name = 'Rome'
UNION ALL
SELECT c.id, 'Tower of London & Crown Jewels', 'Culture', 'Explore historic royal fortress and medieval armor.', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80', 32.00, 3.00, 4.80 FROM cities c WHERE c.name = 'London'
UNION ALL
SELECT c.id, 'Statue of Liberty & Ellis Island', 'Sightseeing', 'Ferry ride to iconic lady liberty and immigration museum.', 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=800&q=80', 25.00, 4.00, 4.80 FROM cities c WHERE c.name = 'New York'
UNION ALL
SELECT c.id, 'Sydney Opera House Guided Tour', 'Culture', 'Go behind the scenes of world-famous architectural sails.', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80', 35.00, 1.50, 4.90 FROM cities c WHERE c.name = 'Sydney'
UNION ALL
SELECT c.id, 'Gardens by the Bay & Supertrees', 'Sightseeing', 'Explore Flower Dome, Cloud Forest, and light show.', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80', 28.00, 3.00, 4.90 FROM cities c WHERE c.name = 'Singapore';
