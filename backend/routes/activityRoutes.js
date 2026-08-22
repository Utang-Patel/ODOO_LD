import express from 'express';
import {
  getActivities,
  getCityActivities,
  searchActivities,
  getActivityById
} from '../controllers/activityController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getActivities);
router.get('/search', searchActivities);
router.get('/city/:cityId', getCityActivities);
router.get('/:id', getActivityById);

export default router;
