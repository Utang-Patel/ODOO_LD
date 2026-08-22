import api from './api';

export const tripStopService = {
  // Get all stops for a trip
  getStops: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/stops`);
    return response.data;
  },

  // Add a new city stop to a trip
  addStop: async (tripId, stopData) => {
    const response = await api.post(`/trips/${tripId}/stops`, stopData);
    return response.data;
  },

  // Update existing trip stop dates or order
  updateStop: async (tripId, stopId, stopData) => {
    const response = await api.put(`/trips/${tripId}/stops/${stopId}`, stopData);
    return response.data;
  },

  // Delete trip stop
  deleteStop: async (tripId, stopId) => {
    const response = await api.delete(`/trips/${tripId}/stops/${stopId}`);
    return response.data;
  },

  // Reorder trip stops array
  reorderStops: async (tripId, stopIds) => {
    const response = await api.post(`/trips/${tripId}/stops/reorder`, { stopIds });
    return response.data;
  }
};

export default tripStopService;
