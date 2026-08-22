import { Trip } from '../models/index.js';

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res) => {
  try {
    const { trip_name, description, start_date, end_date, cover_image, budget_limit, currency } = req.body;
    const userId = req.user.id;

    // Validation
    if (!trip_name || !trip_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Trip name is required.'
      });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Both start date and end date are required.'
      });
    }

    // Date Validation
    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be before start date.'
      });
    }

    // Budget limit validation if provided
    if (budget_limit !== undefined && budget_limit !== null && budget_limit !== '') {
      const parsedLimit = parseFloat(budget_limit);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Budget limit must be greater than zero.'
        });
      }
    }

    const defaultCover = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80";

    const newTrip = await Trip.create({
      user_id: userId,
      trip_name: trip_name.trim(),
      description: description ? description.trim() : null,
      start_date,
      end_date,
      cover_image: cover_image || defaultCover,
      budget_limit: budget_limit ? parseFloat(budget_limit) : null,
      currency: currency || 'INR'
    });

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully! ✈️',
      trip: newTrip
    });
  } catch (error) {
    console.error('[Create Trip Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to create trip. Please try again.'
    });
  }
};

// @desc    Get all trips belonging to the authenticated user
// @route   GET /api/trips
// @access  Private
export const getTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    const trips = await Trip.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      trips
    });
  } catch (error) {
    console.error('[Get Trips Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to load your trips.'
    });
  }
};

// @desc    Get a single trip by ID belonging to the authenticated user
// @route   GET /api/trips/:id
// @access  Private
export const getTripById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trip = await Trip.findByPk(id);

    if (!trip || trip.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found.'
      });
    }

    return res.status(200).json({
      success: true,
      trip
    });
  } catch (error) {
    console.error('[Get Trip By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to load trip details.'
    });
  }
};

// @desc    Update an existing trip
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { trip_name, description, start_date, end_date, cover_image, budget_limit, currency } = req.body;

    const trip = await Trip.findByPk(id);

    if (!trip || trip.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found.'
      });
    }

    if (trip_name !== undefined && !trip_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Trip name cannot be empty.'
      });
    }

    const effectiveStartDate = start_date || trip.start_date;
    const effectiveEndDate = end_date || trip.end_date;

    if (new Date(effectiveEndDate) < new Date(effectiveStartDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be before start date.'
      });
    }

    if (budget_limit !== undefined && budget_limit !== null && budget_limit !== '') {
      const parsedLimit = parseFloat(budget_limit);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Budget limit must be greater than zero.'
        });
      }
    }

    if (trip_name) trip.trip_name = trip_name.trim();
    if (description !== undefined) trip.description = description ? description.trim() : null;
    if (start_date) trip.start_date = start_date;
    if (end_date) trip.end_date = end_date;
    if (cover_image !== undefined) trip.cover_image = cover_image;
    if (budget_limit !== undefined) trip.budget_limit = budget_limit ? parseFloat(budget_limit) : null;
    if (currency) trip.currency = currency;

    await trip.save();

    return res.status(200).json({
      success: true,
      message: 'Trip updated successfully!',
      trip
    });
  } catch (error) {
    console.error('[Update Trip Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update trip. Please try again.'
    });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trip = await Trip.findByPk(id);

    if (!trip || trip.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found.'
      });
    }

    await trip.destroy();

    return res.status(200).json({
      success: true,
      message: 'Trip deleted successfully.'
    });
  } catch (error) {
    console.error('[Delete Trip Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete this trip. Please try again.'
    });
  }
};
