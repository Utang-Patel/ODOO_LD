import { SavedDestination, City } from '../models/index.js';

// @desc    Get user saved destinations
// @route   GET /api/profile/saved-destinations
// @access  Private
export const getSavedDestinations = async (req, res) => {
  try {
    const userId = req.user.id;

    const saved = await SavedDestination.findAll({
      where: { user_id: userId },
      include: [{ model: City, as: 'city' }],
      order: [['created_at', 'DESC']]
    });

    const cities = saved.map((s) => s.city).filter(Boolean);

    return res.status(200).json({
      success: true,
      savedDestinations: cities,
      savedIds: cities.map((c) => c.id)
    });
  } catch (error) {
    console.error('[Get Saved Destinations Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch saved destinations.'
    });
  }
};

// @desc    Save a city to user profile
// @route   POST /api/profile/saved-destinations/:cityId
// @access  Private
export const saveDestination = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cityId } = req.params;

    const city = await City.findByPk(cityId);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found.'
      });
    }

    const [savedRecord, created] = await SavedDestination.findOrCreate({
      where: { user_id: userId, city_id: cityId }
    });

    return res.status(200).json({
      success: true,
      message: created ? 'Destination saved to your profile! ❤️' : 'Destination already saved.',
      isSaved: true
    });
  } catch (error) {
    console.error('[Save Destination Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to save destination.'
    });
  }
};

// @desc    Remove a saved city from user profile
// @route   DELETE /api/profile/saved-destinations/:cityId
// @access  Private
export const removeSavedDestination = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cityId } = req.params;

    const deleted = await SavedDestination.destroy({
      where: { user_id: userId, city_id: cityId }
    });

    return res.status(200).json({
      success: true,
      message: 'Destination removed from saved list.',
      isSaved: false
    });
  } catch (error) {
    console.error('[Remove Saved Destination Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to remove saved destination.'
    });
  }
};
