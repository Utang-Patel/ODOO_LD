import express from 'express';
import {
  addStop,
  getStops,
  updateStop,
  deleteStop,
  reorderStops
} from '../controllers/tripStopController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', addStop);
router.get('/', getStops);
router.post('/reorder', reorderStops);
router.put('/:stopId', updateStop);
router.delete('/:stopId', deleteStop);

export default router;
