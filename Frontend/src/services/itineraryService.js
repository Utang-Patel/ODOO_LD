import api from './api';

export const itineraryService = {
  // Get all itinerary items for a trip
  getItinerary: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/itinerary`);
    return response.data;
  },

  // Add an activity item to a trip day
  addItem: async (tripId, itemData) => {
    const response = await api.post(`/trips/${tripId}/itinerary`, itemData);
    return response.data;
  },

  // Update existing itinerary item
  updateItem: async (tripId, itemId, itemData) => {
    const response = await api.put(`/trips/${tripId}/itinerary/${itemId}`, itemData);
    return response.data;
  },

  // Delete itinerary item
  deleteItem: async (tripId, itemId) => {
    const response = await api.delete(`/trips/${tripId}/itinerary/${itemId}`);
    return response.data;
  },

  // Reorder itinerary items
  reorderItems: async (tripId, itemIds) => {
    const response = await api.post(`/trips/${tripId}/itinerary/reorder`, { itemIds });
    return response.data;
  }
};

export default itineraryService;
