import API from './api';

export const birthdayService = {
  // Public
  async getPublicBySlug(slug, password = null) {
    const config = {};
    if (password) {
      config.headers = { 'X-Birthday-Password': password };
    }
    const response = await API.get(`/public/birthdays/${slug}`, config);
    return response.data;
  },

  async unlockPublicPage(slug, password) {
    const response = await API.post(`/public/birthdays/${slug}/unlock`, { password });
    return response.data;
  },

  // Admin
  async getAll() {
    const response = await API.get('/birthdays');
    return response.data;
  },

  async getStats() {
    const response = await API.get('/birthdays/stats/overview');
    return response.data;
  },

  async getById(id) {
    const response = await API.get(`/birthdays/${id}`);
    return response.data;
  },

  async create(data) {
    const isFormData = data instanceof FormData;
    const response = await API.post('/birthdays', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async update(id, data) {
    const isFormData = data instanceof FormData;
    const response = await API.put(`/birthdays/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async delete(id) {
    const response = await API.delete(`/birthdays/${id}`);
    return response.data;
  },

  async publish(id) {
    const response = await API.post(`/birthdays/${id}/publish`);
    return response.data;
  },

  async unpublish(id) {
    const response = await API.post(`/birthdays/${id}/unpublish`);
    return response.data;
  },

  async updateSettings(id, settings) {
    const response = await API.put(`/birthdays/${id}/settings`, settings);
    return response.data;
  }
};
