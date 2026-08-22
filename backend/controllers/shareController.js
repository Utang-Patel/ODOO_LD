import crypto from 'crypto';
import { Trip, TripStop, City, Activity, ItineraryItem } from '../models/index.js';

// @desc    Make trip public and generate a cryptographically secure share token
// @route   POST /api/trips/:tripId/share
// @access  Private (Owner Only)
export const shareTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findByPk(tripId);
    if (!trip || trip.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.'
      });
    }

    let token = trip.share_token;
    if (!token) {
      token = crypto.randomBytes(16).toString('hex');
    }

    trip.is_public = true;
    trip.share_token = token;
    await trip.save();

    return res.status(200).json({
      success: true,
      message: 'Trip is now public! Anyone with the link can view your itinerary.',
      is_public: true,
      share_token: token,
      share_url: `/shared/${token}`
    });
  } catch (error) {
    console.error('[Share Trip Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to share trip.'
    });
  }
};

// @desc    Make trip private and invalidate public share token
// @route   DELETE /api/trips/:tripId/share
// @access  Private (Owner Only)
export const unshareTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findByPk(tripId);
    if (!trip || trip.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.'
      });
    }

    trip.is_public = false;
    trip.share_token = null;
    await trip.save();

    return res.status(200).json({
      success: true,
      message: 'Trip is now private. Previous share links have been invalidated.',
      is_public: false,
      share_token: null
    });
  } catch (error) {
    console.error('[Unshare Trip Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to unshare trip.'
    });
  }
};

// @desc    Get public read-only shared trip details
// @route   GET /api/shared/:shareToken
// @access  Public (NO JWT Required)
export const getSharedTrip = async (req, res) => {
  try {
    const { shareToken } = req.params;

    if (!shareToken) {
      return res.status(404).json({
        success: false,
        message: 'Shared itinerary link invalid.'
      });
    }

    const trip = await Trip.findOne({
      where: { share_token: shareToken, is_public: true },
      attributes: ['id', 'trip_name', 'description', 'start_date', 'end_date', 'cover_image', 'created_at']
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'This itinerary is either private or no longer available.'
      });
    }

    const stops = await TripStop.findAll({
      where: { trip_id: trip.id },
      include: [{ model: City, as: 'city' }],
      order: [['stop_order', 'ASC']]
    });

    const items = await ItineraryItem.findAll({
      where: { trip_id: trip.id },
      include: [
        { model: Activity, as: 'activity', include: [{ model: City, as: 'city' }] },
        { model: TripStop, as: 'tripStop', include: [{ model: City, as: 'city' }] }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      trip,
      stops,
      items
    });
  } catch (error) {
    console.error('[Get Shared Trip Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to load shared itinerary.'
    });
  }
};

// @desc    Clone a public trip into the authenticated user account
// @route   POST /api/shared/:shareToken/copy
// @access  Private (JWT Required)
export const copySharedTrip = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const userId = req.user.id;

    const originalTrip = await Trip.findOne({
      where: { share_token: shareToken, is_public: true }
    });

    if (!originalTrip) {
      return res.status(404).json({
        success: false,
        message: 'This shared itinerary cannot be found or is private.'
      });
    }

    // 1. Create new Trip owned by authenticated user
    const copiedTrip = await Trip.create({
      user_id: userId,
      trip_name: `Copy of ${originalTrip.trip_name}`,
      description: originalTrip.description,
      start_date: originalTrip.start_date,
      end_date: originalTrip.end_date,
      cover_image: originalTrip.cover_image,
      budget_limit: originalTrip.budget_limit,
      currency: originalTrip.currency,
      is_public: false,
      share_token: null
    });

    // 2. Fetch original stops
    const originalStops = await TripStop.findAll({
      where: { trip_id: originalTrip.id },
      order: [['stop_order', 'ASC']]
    });

    const stopIdMapping = {}; // Maps old stopId -> new stopId

    for (const oldStop of originalStops) {
      const newStop = await TripStop.create({
        trip_id: copiedTrip.id,
        city_id: oldStop.city_id,
        arrival_date: oldStop.arrival_date,
        departure_date: oldStop.departure_date,
        stop_order: oldStop.stop_order
      });
      stopIdMapping[oldStop.id] = newStop.id;
    }

    // 3. Fetch original itinerary items
    const originalItems = await ItineraryItem.findAll({
      where: { trip_id: originalTrip.id }
    });

    for (const oldItem of originalItems) {
      const mappedStopId = stopIdMapping[oldItem.trip_stop_id];
      if (mappedStopId) {
        await ItineraryItem.create({
          trip_id: copiedTrip.id,
          trip_stop_id: mappedStopId,
          activity_id: oldItem.activity_id,
          date: oldItem.date,
          start_time: oldItem.start_time,
          end_time: oldItem.end_time,
          item_order: oldItem.item_order,
          notes: oldItem.notes
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Itinerary copied to your trips successfully! ✈️',
      copiedTrip
    });
  } catch (error) {
    console.error('[Copy Shared Trip Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to copy this itinerary.'
    });
  }
};
