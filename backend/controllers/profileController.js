import { User } from '../models/index.js';

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'profile_image', 'language', 'created_at']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('[Get Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch user profile.'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, profile_image, language } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Full name cannot be empty.'
        });
      }
      user.name = name.trim();
    }

    if (profile_image !== undefined) {
      user.profile_image = profile_image ? profile_image.trim() : null;
    }

    if (language !== undefined) {
      const validLanguages = ['en', 'hi', 'gu'];
      if (!validLanguages.includes(language)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid language preference (supported: en, hi, gu).'
        });
      }
      user.language = language;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image,
        language: user.language
      }
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update profile.'
    });
  }
};

// @desc    Delete user account and all owned travel data safely
// @route   DELETE /api/profile
// @access  Private
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    // Destroy user record. Sequelize CASCADE handles owned trips, stops, items, expenses & savedDestinations
    await user.destroy();

    return res.status(200).json({
      success: true,
      message: 'Your account and travel data have been permanently deleted.'
    });
  } catch (error) {
    console.error('[Delete Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete account. Please try again.'
    });
  }
};
