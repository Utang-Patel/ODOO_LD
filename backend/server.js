import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { ensureDatabaseExists } from './config/database.js';

// Import Models & Relationships
import './models/index.js';

// Import Seed Utility
import { seedDatabaseIfEmpty } from './utils/seedData.js';

// Import Middleware
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import tripStopRoutes from './routes/tripStopRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import shareRoutes from './routes/shareRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GlobeTrotter API is running'
  });
});

// API Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);

// Sharing & Public Trip Routes
app.use('/api', shareRoutes);

// Nested Trip Sub-Routes
app.use('/api/trips/:tripId/stops', tripStopRoutes);
app.use('/api/trips/:tripId/itinerary', itineraryRoutes);
app.use('/api/trips/:tripId/expenses', expenseRoutes);

// 404 Catch-all Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Initialize Database & Start Express Server
const startServer = async () => {
  try {
    // 1. Ensure MySQL Database exists
    await ensureDatabaseExists();

    // 2. Authenticate Sequelize
    await sequelize.authenticate();
    console.log('[Database] Sequelize connected to MySQL successfully.');

    // 3. Sync Models safely (alter: true adds missing columns without dropping data)
    await sequelize.sync({ alter: true });
    console.log('[Database] Models synchronized with MySQL schema.');

    // 4. Seed Database if empty
    await seedDatabaseIfEmpty();

    // 5. Start Server with formatted clickable links
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 GlobeTrotter Backend API is running!`);
      console.log(`   ➜ API Health Check:  http://localhost:${PORT}/api/health`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`[Server Error] Port ${PORT} is currently in use by another process.`);
      } else {
        console.error('[Server Error]:', error.message);
      }
    });

  } catch (error) {
    console.error('[Server Error] Failed to start backend:', error.message);
  }
};

startServer();
