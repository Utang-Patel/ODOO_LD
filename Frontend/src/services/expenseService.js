import api from './api';

export const expenseService = {
  // Get all expenses for a trip
  getExpenses: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/expenses`);
    return response.data;
  },

  // Add a new expense
  addExpense: async (tripId, expenseData) => {
    const response = await api.post(`/trips/${tripId}/expenses`, expenseData);
    return response.data;
  },

  // Update existing expense
  updateExpense: async (tripId, expenseId, expenseData) => {
    const response = await api.put(`/trips/${tripId}/expenses/${expenseId}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (tripId, expenseId) => {
    const response = await api.delete(`/trips/${tripId}/expenses/${expenseId}`);
    return response.data;
  }
};

export default expenseService;
