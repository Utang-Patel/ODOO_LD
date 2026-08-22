import api from './api';

export const savedDestinationService = {
  // Get all saved cities for authenticated user
  getSavedDestinations: async () => {
    const response = await api.get('/profile/saved-destinations');
    return response.data;
  },

  // Save a city to profile
  saveDestination: async (cityId) => {
    const response = await api.post(`/profile/saved-destinations/${cityId}`);
    return response.data;
  },

  // Remove a saved city
  removeSavedDestination: async (cityId) => {
    const response = await api.delete(`/profile/saved-destinations/${cityId}`);
    return response.data;
  }
};

export default savedDestinationService;
