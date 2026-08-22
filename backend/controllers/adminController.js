import { User, Trip, City, Activity, TripStop, ItineraryItem, Expense, SavedDestination, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Get system-wide analytics and statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTrips = await Trip.count();
    const totalStops = await TripStop.count();
    const totalItineraryItems = await ItineraryItem.count();
    const totalExpensesCount = await Expense.count();
    const totalExpensesSum = await Expense.sum('amount') || 0;

    // Top Cities by Trip Stops
    const topCitiesGroup = await TripStop.findAll({
      attributes: [
        'city_id',
        [sequelize.fn('COUNT', sequelize.col('city_id')), 'stopCount']
      ],
      group: ['city_id'],
      order: [[sequelize.literal('stopCount'), 'DESC']],
      limit: 5,
      include: [{ model: City, as: 'city', attributes: ['id', 'city_name', 'country', 'image', 'cost_index'] }]
    });

    // Top Activities scheduled in Itineraries
    const topActivitiesGroup = await ItineraryItem.findAll({
      attributes: [
        'activity_id',
        [sequelize.fn('COUNT', sequelize.col('activity_id')), 'scheduledCount']
      ],
      group: ['activity_id'],
      order: [[sequelize.literal('scheduledCount'), 'DESC']],
      limit: 5,
      include: [{ model: Activity, as: 'activity', attributes: ['id', 'activity_name', 'category', 'cost', 'rating'] }]
    });

    // Expense Category Totals
    const expenseCategoryGroup = await Expense.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      group: ['category']
    });

    // Recent 5 Users (Excluding Passwords)
    const recentUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    // Recent 5 Trips
    const recentTrips = await Trip.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalTrips,
        totalStops,
        totalItineraryItems,
        totalExpensesCount,
        totalExpensesSum: parseFloat(totalExpensesSum),
        topCities: topCitiesGroup,
        topActivities: topActivitiesGroup,
        expenseCategoryTotals: expenseCategoryGroup,
        recentUsers,
        recentTrips
      }
    });
  } catch (error) {
    console.error('[Get Admin Stats Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to load admin analytics.'
    });
  }
};

// @desc    Get directory of all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'profile_image', 'language', 'created_at'],
      include: [
        { model: Trip, as: 'trips', attributes: ['id'] },
        { model: SavedDestination, as: 'savedDestinations', attributes: ['id'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const userDirectory = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      profile_image: u.profile_image,
      language: u.language,
      created_at: u.created_at,
      tripCount: u.trips ? u.trips.length : 0,
      savedCount: u.savedDestinations ? u.savedDestinations.length : 0
    }));

    return res.status(200).json({
      success: true,
      users: userDirectory
    });
  } catch (error) {
    console.error('[Get Admin Users Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch user directory.'
    });
  }
};

// @desc    Update a user role (user <-> admin)
// @route   PUT /api/admin/users/:userId/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['user', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified (must be "user" or "admin").'
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found.'
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.name} role updated to "${role}".`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[Update User Role Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update user role.'
    });
  }
};

// @desc    Get all trips across platform
// @route   GET /api/admin/trips
// @access  Private/Admin
export const getAdminTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: TripStop, as: 'stops', attributes: ['id'] },
        { model: ItineraryItem, as: 'itineraryItems', attributes: ['id'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      trips
    });
  } catch (error) {
    console.error('[Get Admin Trips Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch platform trips.'
    });
  }
};
