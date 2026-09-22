import API from './api';

export const photoService = {
  async getPhotos(birthdayId) {
    const response = await API.get(`/birthdays/${birthdayId}/photos`);
    return response.data;
  },

  async addPhoto(birthdayId, data) {
    const isFormData = data instanceof FormData;
    const response = await API.post(`/birthdays/${birthdayId}/photos`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async addPhotosBatch(birthdayId, data) {
    const isFormData = data instanceof FormData;
    const response = await API.post(`/birthdays/${birthdayId}/photos/batch`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async updatePhoto(birthdayId, photoId, data) {
    const isFormData = data instanceof FormData;
    const response = await API.put(`/birthdays/${birthdayId}/photos/${photoId}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async deletePhoto(birthdayId, photoId) {
    const response = await API.delete(`/birthdays/${birthdayId}/photos/${photoId}`);
    return response.data;
  },

  async reorderPhotos(birthdayId, order) {
    const response = await API.patch(`/birthdays/${birthdayId}/photos/reorder`, { order });
    return response.data;
  }
};
