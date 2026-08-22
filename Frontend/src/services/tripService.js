import api from './api';

export const tripService = {
  // Create a new trip
  createTrip: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  // Get all trips for the authenticated user
  getTrips: async () => {
    const response = await api.get('/trips');
    return response.data;
  },

  // Get single trip by ID
  getTrip: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  // Update existing trip
  updateTrip: async (id, tripData) => {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data;
  },

  // Delete trip
  deleteTrip: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  }
};

export default tripService;
