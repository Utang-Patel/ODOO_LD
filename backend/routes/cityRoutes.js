import express from 'express';
import { getCities, searchCities, getCityById } from '../controllers/cityController.js';

const router = express.Router();

router.get('/', getCities);
router.get('/search', searchCities);
router.get('/:id', getCityById);

export default router;
