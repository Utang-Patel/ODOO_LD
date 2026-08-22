import api from './api';

export const adminService = {
  // Get system-wide platform statistics
  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get list of platform users
  getAdminUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Update a user's role (user <-> admin)
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Get platform trips summary
  getAdminTrips: async () => {
    const response = await api.get('/admin/trips');
    return response.data;
  }
};

export default adminService;
