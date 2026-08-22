import { Activity, City } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// @desc    Get all activities with optional filters
// @route   GET /api/activities
// @access  Public
export const getActivities = async (req, res) => {
  try {
    const { category, city_id } = req.query;
    const where = {};

    if (category && category !== 'All') where.category = category;
    if (city_id) where.city_id = city_id;

    const activities = await Activity.findAll({
      where,
      include: [{ model: City, as: 'city', attributes: ['id', 'city_name', 'country'] }],
      order: [['rating', 'DESC'], ['activity_name', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('[Get Activities Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch activities.'
    });
  }
};

// @desc    Get activities for a specific city
// @route   GET /api/cities/:cityId/activities
// @access  Public
export const getCityActivities = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { category } = req.query;
    const where = { city_id: cityId };

    if (category && category !== 'All') where.category = category;

    const activities = await Activity.findAll({
      where,
      include: [{ model: City, as: 'city', attributes: ['id', 'city_name', 'country'] }],
      order: [['rating', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('[Get City Activities Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch activities for this city.'
    });
  }
};

// @desc    Search activities by name or category
// @route   GET /api/activities/search
// @access  Public
export const searchActivities = async (req, res) => {
  try {
    const { q, city_id } = req.query;
    const where = {};

    if (city_id) where.city_id = city_id;

    if (q && q.trim()) {
      const queryStr = `%${q.trim().toLowerCase()}%`;
      where[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('activity_name')), 'LIKE', queryStr),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('category')), 'LIKE', queryStr)
      ];
    }

    const activities = await Activity.findAll({
      where,
      include: [{ model: City, as: 'city', attributes: ['id', 'city_name', 'country'] }],
      order: [['rating', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('[Search Activities Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to search activities.'
    });
  }
};

// @desc    Get activity details by ID
// @route   GET /api/activities/:id
// @access  Public
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id, {
      include: [{ model: City, as: 'city' }]
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found.'
      });
    }

    return res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('[Get Activity By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch activity details.'
    });
  }
};
