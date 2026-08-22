import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profileController.js';
import {
  getSavedDestinations,
  saveDestination,
  removeSavedDestination
} from '../controllers/savedDestinationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Profile CRUD
router.get('/', getProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);

// Saved Destinations Sub-Routes
router.get('/saved-destinations', getSavedDestinations);
router.post('/saved-destinations/:cityId', saveDestination);
router.delete('/saved-destinations/:cityId', removeSavedDestination);

export default router;
