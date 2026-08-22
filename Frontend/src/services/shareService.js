import api from './api';

export const shareService = {
  // Make trip public & get share token URL
  shareTrip: async (tripId) => {
    const response = await api.post(`/trips/${tripId}/share`);
    return response.data;
  },

  // Make trip private & invalidate token
  unshareTrip: async (tripId) => {
    const response = await api.delete(`/trips/${tripId}/share`);
    return response.data;
  },

  // Get public read-only trip (NO JWT required)
  getSharedTrip: async (token) => {
    const response = await api.get(`/shared/${token}`);
    return response.data;
  },

  // Copy a public trip into user's account
  copySharedTrip: async (token) => {
    const response = await api.post(`/shared/${token}/copy`);
    return response.data;
  }
};

export default shareService;
