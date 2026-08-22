import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { ensureDatabaseExists } from './config/database.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration to allow Vite frontend on any port during development
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

// Authentication Routes
app.use('/api/auth', authRoutes);

// Catch-all route handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Initialize Database & Start Express Server
const startServer = async () => {
  try {
    // 1. Ensure MySQL Database exists
    await ensureDatabaseExists();

    // 2. Authenticate Sequelize
    await sequelize.authenticate();
    console.log('[Database] Sequelize connected to MySQL successfully.');

    // 3. Sync Models
    await sequelize.sync({ alter: true });
    console.log('[Database] Models synchronized with MySQL schema.');

    // 4. Start Server
    app.listen(PORT, () => {
      console.log(`[Server] GlobeTrotter API backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[Server Error] Failed to start backend:', error.message);
  }
};

startServer();
