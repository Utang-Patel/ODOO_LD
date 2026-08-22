import api from './api';

export const cityService = {
  // Get all cities with optional filter query params
  getCities: async (params = {}) => {
    const response = await api.get('/cities', { params });
    return response.data;
  },

  // Search cities by name or country
  searchCities: async (query) => {
    const response = await api.get('/cities/search', { params: { q: query } });
    return response.data;
  },

  // Get city details by ID
  getCity: async (id) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  }
};

export default cityService;
