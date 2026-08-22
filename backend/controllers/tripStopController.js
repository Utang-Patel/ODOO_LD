import { Trip, TripStop, City } from '../models/index.js';

// Helper function to verify trip ownership
const verifyTripOwnership = async (tripId, userId) => {
  const trip = await Trip.findByPk(tripId);
  if (!trip || trip.user_id !== userId) {
    return null;
  }
  return trip;
};

// @desc    Add a city stop to a trip
// @route   POST /api/trips/:tripId/stops
// @access  Private
export const addStop = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const { city_id, arrival_date, departure_date, stop_order } = req.body;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const city = await City.findByPk(city_id);
    if (!city) {
      return res.status(400).json({ success: false, message: 'Invalid city selected.' });
    }

    if (!arrival_date || !departure_date) {
      return res.status(400).json({ success: false, message: 'Arrival and departure dates are required.' });
    }

    if (new Date(departure_date) < new Date(arrival_date)) {
      return res.status(400).json({ success: false, message: 'Departure date cannot be before arrival date.' });
    }

    // Validate stop dates fall within trip date boundaries
    const tripStart = new Date(trip.start_date);
    const tripEnd = new Date(trip.end_date);
    const arrDate = new Date(arrival_date);
    const depDate = new Date(departure_date);

    if (arrDate < tripStart || depDate > tripEnd) {
      return res.status(400).json({
        success: false,
        message: `Stop dates (${arrival_date} to ${departure_date}) must fall within trip dates (${trip.start_date} to ${trip.end_date}).`
      });
    }

    // Determine stop order if not provided
    let calculatedOrder = stop_order;
    if (!calculatedOrder) {
      const existingStopsCount = await TripStop.count({ where: { trip_id: tripId } });
      calculatedOrder = existingStopsCount + 1;
    }

    const newStop = await TripStop.create({
      trip_id: tripId,
      city_id,
      arrival_date,
      departure_date,
      stop_order: calculatedOrder
    });

    const stopWithCity = await TripStop.findByPk(newStop.id, {
      include: [{ model: City, as: 'city' }]
    });

    return res.status(201).json({
      success: true,
      message: 'City stop added to trip successfully!',
      stop: stopWithCity
    });
  } catch (error) {
    console.error('[Add Trip Stop Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to add city stop.' });
  }
};

// @desc    Get all stops for a trip
// @route   GET /api/trips/:tripId/stops
// @access  Private
export const getStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const stops = await TripStop.findAll({
      where: { trip_id: tripId },
      include: [{ model: City, as: 'city' }],
      order: [['stop_order', 'ASC'], ['arrival_date', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      stops
    });
  } catch (error) {
    console.error('[Get Trip Stops Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch trip stops.' });
  }
};

// @desc    Update a trip stop
// @route   PUT /api/trips/:tripId/stops/:stopId
// @access  Private
export const updateStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const userId = req.user.id;
    const { arrival_date, departure_date, stop_order } = req.body;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const stop = await TripStop.findOne({ where: { id: stopId, trip_id: tripId } });
    if (!stop) {
      return res.status(404).json({ success: false, message: 'Trip stop not found.' });
    }

    const effectiveArr = arrival_date || stop.arrival_date;
    const effectiveDep = departure_date || stop.departure_date;

    if (new Date(effectiveDep) < new Date(effectiveArr)) {
      return res.status(400).json({ success: false, message: 'Departure date cannot be before arrival date.' });
    }

    if (arrival_date) stop.arrival_date = arrival_date;
    if (departure_date) stop.departure_date = departure_date;
    if (stop_order !== undefined) stop.stop_order = stop_order;

    await stop.save();

    const updatedStop = await TripStop.findByPk(stop.id, {
      include: [{ model: City, as: 'city' }]
    });

    return res.status(200).json({
      success: true,
      message: 'Trip stop updated successfully.',
      stop: updatedStop
    });
  } catch (error) {
    console.error('[Update Trip Stop Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to update trip stop.' });
  }
};

// @desc    Delete a trip stop
// @route   DELETE /api/trips/:tripId/stops/:stopId
// @access  Private
export const deleteStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const userId = req.user.id;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const stop = await TripStop.findOne({ where: { id: stopId, trip_id: tripId } });
    if (!stop) {
      return res.status(404).json({ success: false, message: 'Trip stop not found.' });
    }

    await stop.destroy();

    return res.status(200).json({
      success: true,
      message: 'Trip stop removed successfully.'
    });
  } catch (error) {
    console.error('[Delete Trip Stop Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to remove trip stop.' });
  }
};

// @desc    Reorder stops for a trip
// @route   POST /api/trips/:tripId/stops/reorder
// @access  Private
export const reorderStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const { stopIds } = req.body; // Array of stop IDs in new order

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    if (!Array.isArray(stopIds)) {
      return res.status(400).json({ success: false, message: 'stopIds array is required.' });
    }

    for (let index = 0; index < stopIds.length; index++) {
      const sId = stopIds[index];
      await TripStop.update(
        { stop_order: index + 1 },
        { where: { id: sId, trip_id: tripId } }
      );
    }

    const updatedStops = await TripStop.findAll({
      where: { trip_id: tripId },
      include: [{ model: City, as: 'city' }],
      order: [['stop_order', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Stops reordered successfully.',
      stops: updatedStops
    });
  } catch (error) {
    console.error('[Reorder Trip Stops Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to reorder trip stops.' });
  }
};
