import { City, Activity } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Get all cities with optional filtering
// @route   GET /api/cities
// @access  Public
export const getCities = async (req, res) => {
  try {
    const { country, region, cost_index } = req.query;
    const where = {};

    if (country) where.country = country;
    if (region) where.region = region;
    if (cost_index) where.cost_index = cost_index;

    const cities = await City.findAll({
      where,
      order: [['popularity', 'DESC'], ['city_name', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      cities
    });
  } catch (error) {
    console.error('[Get Cities Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch cities.'
    });
  }
};

// @desc    Search cities by name or country
// @route   GET /api/cities/search
// @access  Public
export const searchCities = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      const cities = await City.findAll({ limit: 10, order: [['popularity', 'DESC']] });
      return res.status(200).json({ success: true, cities });
    }

    const queryStr = `%${q.trim().toLowerCase()}%`;

    const cities = await City.findAll({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('city_name')), 'LIKE', queryStr),
          sequelize.where(sequelize.fn('LOWER', sequelize.col('country')), 'LIKE', queryStr)
        ]
      },
      order: [['popularity', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      cities
    });
  } catch (error) {
    console.error('[Search Cities Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to search cities.'
    });
  }
};

// @desc    Get city details by ID
// @route   GET /api/cities/:id
// @access  Public
export const getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findByPk(id, {
      include: [{ model: Activity, as: 'activities' }]
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found.'
      });
    }

    return res.status(200).json({
      success: true,
      city
    });
  } catch (error) {
    console.error('[Get City By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch city details.'
    });
  }
};
