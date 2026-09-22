import API from './api';

export const wishService = {
  // Public
  async submitWish(slug, wishData) {
    const response = await API.post(`/public/birthdays/${slug}/wishes`, wishData);
    return response.data;
  },

  async getPublicWishes(slug, page = 1) {
    const response = await API.get(`/public/birthdays/${slug}/wishes?page=${page}`);
    return response.data;
  },

  // Admin
  async getAdminWishes(birthdayId, params = {}) {
    const response = await API.get(`/birthdays/${birthdayId}/wishes`, { params });
    return response.data;
  },

  async approveWish(birthdayId, wishId) {
    const response = await API.patch(`/birthdays/${birthdayId}/wishes/${wishId}/approve`);
    return response.data;
  },

  async rejectWish(birthdayId, wishId) {
    const response = await API.patch(`/birthdays/${birthdayId}/wishes/${wishId}/reject`);
    return response.data;
  },

  async deleteWish(birthdayId, wishId) {
    const response = await API.delete(`/birthdays/${birthdayId}/wishes/${wishId}`);
    return response.data;
  }
};
