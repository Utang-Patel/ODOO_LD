import bcrypt from 'bcrypt';
import { City, Activity, User } from '../models/index.js';

const SEED_CITIES = [
  {
    city_name: 'Paris',
    country: 'France',
    country_code: 'FR',
    region: 'Europe',
    description: 'The City of Light boasts iconic landmarks, world-class art museums, fashion, and haute cuisine.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    cost_index: '$$$',
    popularity: 5,
    activities: [
      { activity_name: 'Eiffel Tower Sightseeing', category: 'Sightseeing', description: 'Ascend Paris iconic iron tower for panoramic city views.', duration: '2.5 hours', cost: 28.00, currency: 'EUR', rating: 4.9, image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Louvre Museum Tour', category: 'Culture', description: 'Explore Mona Lisa and thousands of world-famous artworks.', duration: '3.5 hours', cost: 22.00, currency: 'EUR', rating: 4.8, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Sunset Seine River Cruise', category: 'Sightseeing', description: 'Glide past Notre-Dame and illuminated Parisian bridges.', duration: '1.5 hours', cost: 18.00, currency: 'EUR', rating: 4.7, image: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Montmartre & Sacré-Cœur Walk', category: 'Culture', description: 'Stroll through bohemian artist alleys and admire cathedral views.', duration: '2 hours', cost: 0.00, currency: 'EUR', rating: 4.8, image: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'French Bistro Gourmet Dinner', category: 'Food', description: 'Sample traditional duck confit, escargot, and French pastries.', duration: '2 hours', cost: 45.00, currency: 'EUR', rating: 4.9, image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    city_name: 'Tokyo',
    country: 'Japan',
    country_code: 'JP',
    region: 'Asia',
    description: 'A captivating blend of ultramodern skyscrapers, neon lights, ancient temples, and culinary delights.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    cost_index: '$$$',
    popularity: 5,
    activities: [
      { activity_name: 'Shibuya Crossing & Hachiko Statue', category: 'Sightseeing', description: 'Experience the world busiest pedestrian crossing.', duration: '1 hour', cost: 0.00, currency: 'JPY', rating: 4.8, image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Senso-ji Temple Walk', category: 'Culture', description: 'Visit Tokyo oldest and most famous Buddhist temple in Asakusa.', duration: '2 hours', cost: 0.00, currency: 'JPY', rating: 4.9, image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Tokyo Skytree Observatory', category: 'Sightseeing', description: 'Enjoy 360-degree views of Tokyo skyline and Mount Fuji.', duration: '2 hours', cost: 25.00, currency: 'JPY', rating: 4.7, image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Tsukiji Outer Market Food Tasting', category: 'Food', description: 'Savor fresh sushi, tamagoyaki, and wagyu skewers.', duration: '2 hours', cost: 35.00, currency: 'JPY', rating: 4.9, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Akihabara Tech & Anime Exploration', category: 'Shopping', description: 'Explore electric town retro gaming shops and maid cafes.', duration: '3 hours', cost: 0.00, currency: 'JPY', rating: 4.6, image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    city_name: 'Dubai',
    country: 'United Arab Emirates',
    country_code: 'AE',
    region: 'Middle East',
    description: 'Famed for luxury shopping, futuristic architecture, desert dunes, and vibrant nightlife.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    cost_index: '$$$',
    popularity: 5,
    activities: [
      { activity_name: 'Burj Khalifa Observation Deck', category: 'Sightseeing', description: 'Stand atop the world tallest building on Level 124 & 125.', duration: '2 hours', cost: 45.00, currency: 'AED', rating: 4.9, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Desert Safari & BBQ Dinner', category: 'Adventure', description: 'Dune bashing, camel riding, henna painting, and belly dancing.', duration: '6 hours', cost: 65.00, currency: 'AED', rating: 4.8, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Dubai Mall & Fountain Show', category: 'Shopping', description: 'Watch choreography of light, water, and music at the fountains.', duration: '3 hours', cost: 0.00, currency: 'AED', rating: 4.9, image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Dubai Marina Luxury Cruise', category: 'Sightseeing', description: 'Sail past glowing skyscrapers along the artificial canal.', duration: '2 hours', cost: 40.00, currency: 'AED', rating: 4.7, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    city_name: 'Bali',
    country: 'Indonesia',
    country_code: 'ID',
    region: 'Asia',
    description: 'An Indonesian paradise renowned for forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    cost_index: '$',
    popularity: 5,
    activities: [
      { activity_name: 'Ubud Tegallalang Rice Terraces', category: 'Nature', description: 'Walk through emerald green stepped fields and giant swings.', duration: '2 hours', cost: 5.00, currency: 'USD', rating: 4.9, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Uluwatu Sunset Temple & Kecak Dance', category: 'Culture', description: 'Watch dramatic cliffside traditional fire dance at dusk.', duration: '3 hours', cost: 15.00, currency: 'USD', rating: 4.8, image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Mount Batur Sunrise Trekking', category: 'Adventure', description: 'Hike an active volcano for a breathtaking sunrise breakfast.', duration: '5 hours', cost: 40.00, currency: 'USD', rating: 4.9, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Seminyak Beach Club Relaxation', category: 'Food', description: 'Chill out with cocktails, ocean waves, and acoustic tunes.', duration: '4 hours', cost: 20.00, currency: 'USD', rating: 4.7, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    city_name: 'Zurich',
    country: 'Switzerland',
    country_code: 'CH',
    region: 'Europe',
    description: 'A financial hub nestled beside Lake Zurich with pristine Old Town cobblestones and mountain backdrop.',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    cost_index: '$$$',
    popularity: 4,
    activities: [
      { activity_name: 'Lake Zurich Boat Excursion', category: 'Sightseeing', description: 'Scenic boat cruise across pristine alpine waters.', duration: '2 hours', cost: 25.00, currency: 'CHF', rating: 4.8, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Altstadt (Old Town) Walking Tour', category: 'Culture', description: 'Discover medieval guild houses, Grossmünster, and Lindenhof.', duration: '2 hours', cost: 0.00, currency: 'CHF', rating: 4.9, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Lindt Home of Chocolate Tour', category: 'Food', description: 'Marvel at giant chocolate fountain and unlimited tastings.', duration: '2 hours', cost: 18.00, currency: 'CHF', rating: 4.9, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Uetliberg Mountain Viewpoint Hike', category: 'Nature', description: 'Panoramas over Zurich, the lake, and the Swiss Alps.', duration: '3 hours', cost: 10.00, currency: 'CHF', rating: 4.8, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    city_name: 'Rome',
    country: 'Italy',
    country_code: 'IT',
    region: 'Europe',
    description: 'The Eternal City packed with nearly 3,000 years of globally influential art, architecture, and cuisine.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    cost_index: '$$',
    popularity: 5,
    activities: [
      { activity_name: 'Colosseum & Roman Forum Tour', category: 'Sightseeing', description: 'Walk through ancient gladiatorial arenas and ruins.', duration: '3 hours', cost: 24.00, currency: 'EUR', rating: 4.9, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Vatican Museums & Sistine Chapel', category: 'Culture', description: 'Admire Michelangelo ceiling frescoes and Saint Peter Basilica.', duration: '3.5 hours', cost: 30.00, currency: 'EUR', rating: 4.9, image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Trevi Fountain & Pantheon Walk', category: 'Sightseeing', description: 'Toss a coin into Trevi Fountain and marvel at dome architecture.', duration: '1.5 hours', cost: 0.00, currency: 'EUR', rating: 4.8, image: 'https://images.unsplash.com/photo-1525874684015-5837e4437705?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Italian Gelato & Pizza Tasting', category: 'Food', description: 'Taste authentic Roman wood-fired pizza and artisanal gelato.', duration: '2 hours', cost: 25.00, currency: 'EUR', rating: 4.9, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    city_name: 'London',
    country: 'United Kingdom',
    country_code: 'GB',
    region: 'Europe',
    description: 'A 21st-century city with history stretching back to Roman times, Big Ben, and West End theatre.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    cost_index: '$$$',
    popularity: 5,
    activities: [
      { activity_name: 'Tower of London & Crown Jewels', category: 'Culture', description: 'Explore historic royal fortress and medieval armor.', duration: '3 hours', cost: 32.00, currency: 'GBP', rating: 4.8, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'London Eye Giant Ferris Wheel', category: 'Sightseeing', description: 'High-altitude views over Big Ben and Parliament.', duration: '1 hour', cost: 30.00, currency: 'GBP', rating: 4.7, image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Borough Market Street Food Tour', category: 'Food', description: 'Taste artisan cheeses, pies, and fresh oysters.', duration: '2 hours', cost: 20.00, currency: 'GBP', rating: 4.9, image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b31f8?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    city_name: 'New York',
    country: 'United States',
    country_code: 'US',
    region: 'North America',
    description: 'The Big Apple features Times Square, Broadway, Central Park, and skyline skyscrapers.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    cost_index: '$$$',
    popularity: 5,
    activities: [
      { activity_name: 'Statue of Liberty & Ellis Island', category: 'Sightseeing', description: 'Ferry ride to iconic lady liberty and immigration museum.', duration: '4 hours', cost: 25.00, currency: 'USD', rating: 4.8, image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Central Park Bicycle Ride', category: 'Nature', description: 'Cycle past Bethesda Terrace, Strawberry Fields, and Bow Bridge.', duration: '2 hours', cost: 15.00, currency: 'USD', rating: 4.9, image: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Broadway Musical Show', category: 'Culture', description: 'World-class theatrical performance in Times Square district.', duration: '3 hours', cost: 85.00, currency: 'USD', rating: 4.9, image: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    city_name: 'Sydney',
    country: 'Australia',
    country_code: 'AU',
    region: 'Oceania',
    description: 'Australia harbour metropolis with Sydney Opera House, Harbour Bridge, and Bondi Beach.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    cost_index: '$$$',
    popularity: 5,
    activities: [
      { activity_name: 'Sydney Opera House Guided Tour', category: 'Culture', description: 'Go behind the scenes of world-famous architectural sails.', duration: '1.5 hours', cost: 35.00, currency: 'AUD', rating: 4.9, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Bondi to Coogee Coastal Walk', category: 'Nature', description: 'Cliffside ocean walk past golden beaches and rock pools.', duration: '2.5 hours', cost: 0.00, currency: 'AUD', rating: 4.9, image: 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    city_name: 'Singapore',
    country: 'Singapore',
    country_code: 'SG',
    region: 'Asia',
    description: 'A modern garden city with futuristic Supertree Grove, Marina Bay Sands, and diverse hawker food.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    cost_index: '$$$',
    popularity: 5,
    activities: [
      { activity_name: 'Gardens by the Bay & Supertrees', category: 'Sightseeing', description: 'Explore Flower Dome, Cloud Forest, and light show.', duration: '3 hours', cost: 28.00, currency: 'SGD', rating: 4.9, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80' },
      { activity_name: 'Lau Pa Sat Hawker Feast', category: 'Food', description: 'Sample Hainanese chicken rice, laksa, and satay skewers.', duration: '1.5 hours', cost: 15.00, currency: 'SGD', rating: 4.8, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80' }
    ]
  }
];

export const seedDatabaseIfEmpty = async () => {
  try {
    // 1. Seed Cities if empty
    const existingCount = await City.count();

    if (existingCount === 0) {
      console.log('[Seed] Seeding initial Cities and Activities...');
      for (const cityData of SEED_CITIES) {
        const { activities, ...cFields } = cityData;
        const createdCity = await City.create(cFields);

        if (activities && activities.length > 0) {
          for (const act of activities) {
            await Activity.create({
              ...act,
              city_id: createdCity.id
            });
          }
        }
      }
      console.log('[Seed] Database seeded successfully with 10 Cities and activities!');
    }

    // 2. Seed Default Admin User if no admin exists
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      console.log('[Seed] Seeding default Admin user account...');
      const hashedPassword = await bcrypt.hash('Admin#123456', 10);
      await User.create({
        name: 'GlobeTrotter Admin',
        email: 'admin@globetrotter.com',
        password: hashedPassword,
        role: 'admin',
        language: 'en'
      });
      console.log('[Seed] Default Admin account created: admin@globetrotter.com / Admin#123456');
    }
  } catch (error) {
    console.error('[Seed Error]: Failed to seed initial database:', error);
  }
};
