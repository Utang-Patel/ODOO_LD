import express from 'express';
import {
  shareTrip,
  unshareTrip,
  getSharedTrip,
  copySharedTrip
} from '../controllers/shareController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Public Endpoint (No JWT)
router.get('/shared/:shareToken', getSharedTrip);

// Protected Endpoint (JWT required to copy)
router.post('/shared/:shareToken/copy', protect, copySharedTrip);

// Protected Owner Endpoints (JWT required to share / unshare)
router.post('/trips/:tripId/share', protect, shareTrip);
router.delete('/trips/:tripId/share', protect, unshareTrip);

export default router;
