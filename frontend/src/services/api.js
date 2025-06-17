import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Chat services
export const chatService = {
  getChatHistory: () => api.get('/chat/history'),
  sendMessage: (message, chatId) => api.post('/chat/message', { message, chatId }),
  deleteChat: (chatId) => api.delete(`/chat/chat/${chatId}`),
  clearHistory: () => api.delete('/chat/history'),
};