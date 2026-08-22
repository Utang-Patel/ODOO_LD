import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';
import { User, Trip, City, Activity, TripStop, ItineraryItem, Expense } from '../models/index.js';

dotenv.config();

const seedDemoTrip = async () => {
  try {
    await sequelize.authenticate();
    console.log('[Demo Seed] Database connected. Altering tables safely for new columns...');

    // Safely sync schema additions without destroying data
    await sequelize.sync({ alter: true });
    console.log('[Demo Seed] Database schema synchronized.');

    // 1. Ensure Demo User Exists
    let demoUser = await User.findOne({ where: { email: 'shreya@example.com' } });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('Password#123', 10);
      demoUser = await User.create({
        name: 'Shreya Raval',
        email: 'shreya@example.com',
        password: hashedPassword,
        role: 'user',
        language: 'en'
      });
      console.log('[Demo Seed] Created demo user: shreya@example.com / Password#123');
    }

    // 2. Check if Demo Trip Exists
    let demoTrip = await Trip.findOne({
      where: { user_id: demoUser.id, trip_name: 'European Summer Adventure' }
    });

    if (!demoTrip) {
      const shareToken = crypto.randomBytes(16).toString('hex');
      demoTrip = await Trip.create({
        user_id: demoUser.id,
        trip_name: 'European Summer Adventure',
        description: 'An incredible 8-day journey through Paris, Zurich, and Rome featuring historic monuments, fine dining, and Alpine lakes.',
        start_date: '2026-09-12',
        end_date: '2026-09-20',
        cover_image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        budget_limit: 2500.00,
        currency: 'EUR',
        is_public: true,
        share_token: shareToken
      });
      console.log(`[Demo Seed] Created demo trip: "European Summer Adventure" (Share Token: ${shareToken})`);

      // Find Cities
      const paris = await City.findOne({ where: { city_name: 'Paris' } });
      const zurich = await City.findOne({ where: { city_name: 'Zurich' } });
      const rome = await City.findOne({ where: { city_name: 'Rome' } });

      if (paris && zurich && rome) {
        // Create Trip Stops
        const stop1 = await TripStop.create({
          trip_id: demoTrip.id,
          city_id: paris.id,
          arrival_date: '2026-09-12',
          departure_date: '2026-09-15',
          stop_order: 1
        });

        const stop2 = await TripStop.create({
          trip_id: demoTrip.id,
          city_id: zurich.id,
          arrival_date: '2026-09-15',
          departure_date: '2026-09-17',
          stop_order: 2
        });

        const stop3 = await TripStop.create({
          trip_id: demoTrip.id,
          city_id: rome.id,
          arrival_date: '2026-09-17',
          departure_date: '2026-09-20',
          stop_order: 3
        });

        // Add Itinerary Items
        const eiffel = await Activity.findOne({ where: { city_id: paris.id } });
        if (eiffel) {
          await ItineraryItem.create({
            trip_id: demoTrip.id,
            trip_stop_id: stop1.id,
            activity_id: eiffel.id,
            date: '2026-09-13',
            start_time: '10:00',
            end_time: '12:30',
            item_order: 1,
            notes: 'Pre-booked skip-the-line elevator tickets.'
          });
        }

        const zurichWalk = await Activity.findOne({ where: { city_id: zurich.id } });
        if (zurichWalk) {
          await ItineraryItem.create({
            trip_id: demoTrip.id,
            trip_stop_id: stop2.id,
            activity_id: zurichWalk.id,
            date: '2026-09-16',
            start_time: '14:00',
            end_time: '16:00',
            item_order: 1,
            notes: 'Explore Lindenhof viewpoint and Grossmünster.'
          });
        }

        const colosseum = await Activity.findOne({ where: { city_id: rome.id } });
        if (colosseum) {
          await ItineraryItem.create({
            trip_id: demoTrip.id,
            trip_stop_id: stop3.id,
            activity_id: colosseum.id,
            date: '2026-09-18',
            start_time: '09:30',
            end_time: '12:30',
            item_order: 1,
            notes: 'Guided tour of the Roman Forum & Palatine Hill.'
          });
        }

        // Add Demo Expenses
        await Expense.create({
          trip_id: demoTrip.id,
          category: 'Transport',
          description: 'High-speed TGV Train Paris to Zurich',
          amount: 180.00,
          currency: 'EUR',
          expense_date: '2026-09-15'
        });

        await Expense.create({
          trip_id: demoTrip.id,
          category: 'Accommodation',
          description: 'Boutique Hotel Stay in Paris Marais',
          amount: 450.00,
          currency: 'EUR',
          expense_date: '2026-09-12'
        });

        await Expense.create({
          trip_id: demoTrip.id,
          category: 'Meals',
          description: 'French Bistro Gourmet Dinner',
          amount: 120.00,
          currency: 'EUR',
          expense_date: '2026-09-14'
        });

        console.log('[Demo Seed] Successfully populated stops, itinerary activities, and expenses!');
      }
    } else {
      console.log(`[Demo Seed] Demo trip already exists. Share token: ${demoTrip.share_token}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('[Demo Seed Error]:', error);
    process.exit(1);
  }
};

seedDemoTrip();
