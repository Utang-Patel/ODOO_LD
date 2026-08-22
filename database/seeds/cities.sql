-- ============================================================
-- GlobeTrotter Master City Seeds
-- Target DBMS: MySQL (v8.0+)
-- Database: globetrotter_db
-- ============================================================

USE globetrotter_db;

INSERT INTO cities (name, country, region, description, image, cost_index, popularity)
VALUES
('Paris', 'France', 'Europe', 'The City of Light boasts iconic landmarks, world-class art museums, fashion, and haute cuisine.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', 3.00, 5.00),
('Tokyo', 'Japan', 'Asia', 'A captivating blend of ultramodern skyscrapers, neon lights, ancient temples, and culinary delights.', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80', 3.00, 5.00),
('Dubai', 'United Arab Emirates', 'Middle East', 'Famed for luxury shopping, futuristic architecture, desert dunes, and vibrant nightlife.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', 3.00, 5.00),
('Bali', 'Indonesia', 'Asia', 'An Indonesian paradise renowned for forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', 1.00, 5.00),
('Zurich', 'Switzerland', 'Europe', 'A financial hub nestled beside Lake Zurich with pristine Old Town cobblestones and mountain backdrop.', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80', 3.00, 4.00),
('Rome', 'Italy', 'Europe', 'The Eternal City packed with nearly 3,000 years of globally influential art, architecture, and cuisine.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', 2.00, 5.00),
('London', 'United Kingdom', 'Europe', 'A 21st-century city with history stretching back to Roman times, Big Ben, and West End theatre.', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80', 3.00, 5.00),
('New York', 'United States', 'North America', 'The Big Apple features Times Square, Broadway, Central Park, and skyline skyscrapers.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', 3.00, 5.00),
('Sydney', 'Australia', 'Oceania', 'Australia harbour metropolis with Sydney Opera House, Harbour Bridge, and Bondi Beach.', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80', 3.00, 5.00),
('Singapore', 'Singapore', 'Asia', 'A modern garden city with futuristic Supertree Grove, Marina Bay Sands, and diverse hawker food.', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80', 3.00, 5.00)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  image = VALUES(image),
  cost_index = VALUES(cost_index),
  popularity = VALUES(popularity);
