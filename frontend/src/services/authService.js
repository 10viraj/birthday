import API from './api';

export const authService = {
  async login(credentials) {
    const response = await API.post('/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('birthday_bliss_token', response.data.access_token);
      localStorage.setItem('birthday_bliss_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await API.post('/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('birthday_bliss_token', response.data.access_token);
      localStorage.setItem('birthday_bliss_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      await API.post('/logout');
    } catch (e) {
      // ignore token error on logout
    } finally {
      localStorage.removeItem('birthday_bliss_token');
      localStorage.removeItem('birthday_bliss_user');
    }
  },

  async getCurrentUser() {
    const response = await API.get('/user');
    return response.data;
  },

  getUser() {
    const stored = localStorage.getItem('birthday_bliss_user');
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('birthday_bliss_token');
  }
};
