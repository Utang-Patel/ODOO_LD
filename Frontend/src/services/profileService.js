import api from './api';

export const profileService = {
  // Fetch current user profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update profile details
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  // Delete user account permanently
  deleteProfile: async () => {
    const response = await api.delete('/profile');
    return response.data;
  }
};

export default profileService;
