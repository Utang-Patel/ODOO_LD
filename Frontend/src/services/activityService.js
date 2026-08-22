import api from './api';

export const activityService = {
  // Get all activities with optional filters
  getActivities: async (params = {}) => {
    const response = await api.get('/activities', { params });
    return response.data;
  },

  // Get activities for a specific city
  getCityActivities: async (cityId, category = 'All') => {
    const params = category && category !== 'All' ? { category } : {};
    const response = await api.get(`/activities/city/${cityId}`, { params });
    return response.data;
  },

  // Search activities by keyword
  searchActivities: async (query, cityId = null) => {
    const params = { q: query };
    if (cityId) params.city_id = cityId;
    const response = await api.get('/activities/search', { params });
    return response.data;
  },

  // Get activity by ID
  getActivity: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  }
};

export default activityService;
