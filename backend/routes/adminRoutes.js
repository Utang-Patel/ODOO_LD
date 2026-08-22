import express from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
  getAdminTrips
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(protectAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:userId/role', updateUserRole);
router.get('/trips', getAdminTrips);

export default router;
