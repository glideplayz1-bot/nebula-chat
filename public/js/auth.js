// Auth Service
const API_URL = window.location.origin + '/api';
let currentUser = null;
let token = localStorage.getItem('token');

const authService = {
  signup: async (username, email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });
      const data = await response.json();
      if (data.success) {
        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
  },

  getMe: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        currentUser = data.user;
        return data.user;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  },

  isAuthenticated: () => {
    return !!token && !!currentUser;
  },
};

// Fetch helper
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, options);
  return response.json();
};
