import { Trip, TripStop, Activity, ItineraryItem, City } from '../models/index.js';

// Helper function to verify trip ownership
const verifyTripOwnership = async (tripId, userId) => {
  const trip = await Trip.findByPk(tripId);
  if (!trip || trip.user_id !== userId) {
    return null;
  }
  return trip;
};

// @desc    Add an activity to trip itinerary
// @route   POST /api/trips/:tripId/itinerary
// @access  Private
export const addItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const { trip_stop_id, activity_id, date, start_time, end_time, item_order, notes } = req.body;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const activity = await Activity.findByPk(activity_id);
    if (!activity) {
      return res.status(400).json({ success: false, message: 'Selected activity does not exist.' });
    }

    const tripStop = await TripStop.findOne({ where: { id: trip_stop_id, trip_id: tripId } });
    if (!tripStop) {
      return res.status(400).json({ success: false, message: 'Selected city stop does not belong to this trip.' });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: 'Itinerary item date is required.' });
    }

    // Validate activity date falls within stop arrival and departure dates
    const itemDate = new Date(date);
    const stopArrival = new Date(tripStop.arrival_date);
    const stopDeparture = new Date(tripStop.departure_date);

    if (itemDate < stopArrival || itemDate > stopDeparture) {
      return res.status(400).json({
        success: false,
        message: `Activity date (${date}) must fall within this city stop's dates (${tripStop.arrival_date} to ${tripStop.departure_date}).`
      });
    }

    // Validate times if both provided
    if (start_time && end_time && start_time >= end_time) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time.'
      });
    }

    let calculatedOrder = item_order;
    if (!calculatedOrder) {
      const existingItemsCount = await ItineraryItem.count({ where: { trip_id: tripId, date } });
      calculatedOrder = existingItemsCount + 1;
    }

    const newItem = await ItineraryItem.create({
      trip_id: tripId,
      trip_stop_id,
      activity_id,
      date,
      start_time: start_time || '10:00',
      end_time: end_time || '12:00',
      item_order: calculatedOrder,
      notes: notes || null
    });

    const fullItem = await ItineraryItem.findByPk(newItem.id, {
      include: [
        { model: Activity, as: 'activity', include: [{ model: City, as: 'city' }] },
        { model: TripStop, as: 'tripStop', include: [{ model: City, as: 'city' }] }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Activity added to itinerary successfully!',
      item: fullItem
    });
  } catch (error) {
    console.error('[Add Itinerary Item Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to add activity to itinerary.' });
  }
};

// @desc    Get full itinerary items for a trip
// @route   GET /api/trips/:tripId/itinerary
// @access  Private
export const getItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const items = await ItineraryItem.findAll({
      where: { trip_id: tripId },
      include: [
        { model: Activity, as: 'activity', include: [{ model: City, as: 'city' }] },
        { model: TripStop, as: 'tripStop', include: [{ model: City, as: 'city' }] }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC'], ['item_order', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    console.error('[Get Itinerary Items Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch itinerary items.' });
  }
};

// @desc    Update an itinerary item
// @route   PUT /api/trips/:tripId/itinerary/:itemId
// @access  Private
export const updateItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.user.id;
    const { date, start_time, end_time, item_order, notes } = req.body;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const item = await ItineraryItem.findOne({ where: { id: itemId, trip_id: tripId } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found.' });
    }

    const effectiveStart = start_time || item.start_time;
    const effectiveEnd = end_time || item.end_time;

    if (effectiveStart && effectiveEnd && effectiveStart >= effectiveEnd) {
      return res.status(400).json({ success: false, message: 'End time must be after start time.' });
    }

    if (date) item.date = date;
    if (start_time) item.start_time = start_time;
    if (end_time) item.end_time = end_time;
    if (item_order !== undefined) item.item_order = item_order;
    if (notes !== undefined) item.notes = notes;

    await item.save();

    const updatedItem = await ItineraryItem.findByPk(item.id, {
      include: [
        { model: Activity, as: 'activity', include: [{ model: City, as: 'city' }] },
        { model: TripStop, as: 'tripStop', include: [{ model: City, as: 'city' }] }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Itinerary item updated successfully.',
      item: updatedItem
    });
  } catch (error) {
    console.error('[Update Itinerary Item Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to update itinerary item.' });
  }
};

// @desc    Delete an itinerary item
// @route   DELETE /api/trips/:tripId/itinerary/:itemId
// @access  Private
export const deleteItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.user.id;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const item = await ItineraryItem.findOne({ where: { id: itemId, trip_id: tripId } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found.' });
    }

    await item.destroy();

    return res.status(200).json({
      success: true,
      message: 'Activity removed from itinerary successfully.'
    });
  } catch (error) {
    console.error('[Delete Itinerary Item Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to remove itinerary item.' });
  }
};

// @desc    Reorder itinerary items
// @route   POST /api/trips/:tripId/itinerary/reorder
// @access  Private
export const reorderItems = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const { itemIds } = req.body; // Array of item IDs in new order

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    if (!Array.isArray(itemIds)) {
      return res.status(400).json({ success: false, message: 'itemIds array is required.' });
    }

    for (let index = 0; index < itemIds.length; index++) {
      const itId = itemIds[index];
      await ItineraryItem.update(
        { item_order: index + 1 },
        { where: { id: itId, trip_id: tripId } }
      );
    }

    const updatedItems = await ItineraryItem.findAll({
      where: { trip_id: tripId },
      include: [
        { model: Activity, as: 'activity', include: [{ model: City, as: 'city' }] },
        { model: TripStop, as: 'tripStop', include: [{ model: City, as: 'city' }] }
      ],
      order: [['date', 'ASC'], ['item_order', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Itinerary items reordered successfully.',
      items: updatedItems
    });
  } catch (error) {
    console.error('[Reorder Itinerary Items Error]:', error);
    return res.status(500).json({ success: false, message: 'Unable to reorder itinerary items.' });
  }
};
