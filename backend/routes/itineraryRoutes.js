import express from 'express';
import {
  addItem,
  getItinerary,
  updateItem,
  deleteItem,
  reorderItems
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', addItem);
router.get('/', getItinerary);
router.post('/reorder', reorderItems);
router.put('/:itemId', updateItem);
router.delete('/:itemId', deleteItem);

export default router;
