import { Trip, Expense } from '../models/index.js';

// Helper to verify trip ownership
const verifyTripOwnership = async (tripId, userId) => {
  const trip = await Trip.findByPk(tripId);
  if (!trip || trip.user_id !== userId) {
    return null;
  }
  return trip;
};

// @desc    Get all expenses for a trip
// @route   GET /api/trips/:tripId/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.'
      });
    }

    const expenses = await Expense.findAll({
      where: { trip_id: tripId },
      order: [['expense_date', 'ASC'], ['id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      expenses
    });
  } catch (error) {
    console.error('[Get Expenses Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch expenses for this trip.'
    });
  }
};

// @desc    Add a new expense to a trip
// @route   POST /api/trips/:tripId/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const { category, description, amount, currency, expense_date } = req.body;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.'
      });
    }

    // Validations
    const validCategories = ['Transport', 'Accommodation', 'Activities', 'Meals'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Valid expense category is required (Transport, Accommodation, Activities, Meals).'
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Expense amount must be greater than zero.'
      });
    }

    if (!expense_date) {
      return res.status(400).json({
        success: false,
        message: 'Expense date is required.'
      });
    }

    // Validate expense date falls within trip dates
    const tripStart = new Date(trip.start_date);
    const tripEnd = new Date(trip.end_date);
    const expDate = new Date(expense_date);

    if (expDate < tripStart || expDate > tripEnd) {
      return res.status(400).json({
        success: false,
        message: `Expense date (${expense_date}) must fall within trip dates (${trip.start_date} to ${trip.end_date}).`
      });
    }

    const newExpense = await Expense.create({
      trip_id: tripId,
      category,
      description: description ? description.trim() : null,
      amount: parsedAmount,
      currency: currency || trip.currency || 'INR',
      expense_date
    });

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully! 💰',
      expense: newExpense
    });
  } catch (error) {
    console.error('[Create Expense Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to add expense.'
    });
  }
};

// @desc    Update an expense
// @route   PUT /api/trips/:tripId/expenses/:expenseId
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;
    const userId = req.user.id;
    const { category, description, amount, currency, expense_date } = req.body;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.'
      });
    }

    const expense = await Expense.findOne({ where: { id: expenseId, trip_id: tripId } });
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found.'
      });
    }

    if (category) {
      const validCategories = ['Transport', 'Accommodation', 'Activities', 'Meals'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expense category.'
        });
      }
      expense.category = category;
    }

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Expense amount must be greater than zero.'
        });
      }
      expense.amount = parsedAmount;
    }

    if (expense_date) {
      const tripStart = new Date(trip.start_date);
      const tripEnd = new Date(trip.end_date);
      const expDate = new Date(expense_date);

      if (expDate < tripStart || expDate > tripEnd) {
        return res.status(400).json({
          success: false,
          message: `Expense date (${expense_date}) must fall within trip dates (${trip.start_date} to ${trip.end_date}).`
        });
      }
      expense.expense_date = expense_date;
    }

    if (description !== undefined) expense.description = description ? description.trim() : null;
    if (currency) expense.currency = currency;

    await expense.save();

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully.',
      expense
    });
  } catch (error) {
    console.error('[Update Expense Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update expense.'
    });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/trips/:tripId/expenses/:expenseId
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;
    const userId = req.user.id;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.'
      });
    }

    const expense = await Expense.findOne({ where: { id: expenseId, trip_id: tripId } });
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found.'
      });
    }

    await expense.destroy();

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully.'
    });
  } catch (error) {
    console.error('[Delete Expense Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete expense.'
    });
  }
};
