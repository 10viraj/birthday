import API from './api';

export const memoryService = {
  async getMemories(birthdayId) {
    const response = await API.get(`/birthdays/${birthdayId}/memories`);
    return response.data;
  },

  async addMemory(birthdayId, data) {
    const isFormData = data instanceof FormData;
    const response = await API.post(`/birthdays/${birthdayId}/memories`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async updateMemory(birthdayId, memoryId, data) {
    const isFormData = data instanceof FormData;
    const response = await API.put(`/birthdays/${birthdayId}/memories/${memoryId}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async deleteMemory(birthdayId, memoryId) {
    const response = await API.delete(`/birthdays/${birthdayId}/memories/${memoryId}`);
    return response.data;
  }
};
