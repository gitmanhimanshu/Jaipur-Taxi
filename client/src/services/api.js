import axios from 'axios';
import config from '../config/config.js';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  login: (credentials) => api.post(config.ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => api.post(config.ENDPOINTS.AUTH.REGISTER, userData),
  getProfile: () => api.get(config.ENDPOINTS.AUTH.PROFILE),
  updateProfile: (userData) => api.put(config.ENDPOINTS.AUTH.UPDATE_PROFILE, userData),
  changePassword: (passwordData) => api.put(config.ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData),
  uploadProfilePicture: (formData) => api.post(config.ENDPOINTS.AUTH.PROFILE + '/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Taxi API methods
export const taxiAPI = {
  getAll: () => api.get(config.ENDPOINTS.TAXI.ALL),
  getByCategory: (category) => api.get(`${config.ENDPOINTS.TAXI.BY_CATEGORY}/${category}`),
  getById: (id) => api.get(`${config.ENDPOINTS.TAXI.BY_ID}/${id}`),
  calculateFare: (fareData) => api.post(config.ENDPOINTS.TAXI.CALCULATE_FARE, fareData),
  create: (data) => api.post(config.ENDPOINTS.TAXI.ALL, data),
  update: (id, data) => api.put(`${config.ENDPOINTS.TAXI.ALL}/${id}`, data),
  delete: (id) => api.delete(`${config.ENDPOINTS.TAXI.ALL}/${id}`),
  getAdminTaxis: (adminId) => api.get(`${config.ENDPOINTS.TAXI.ALL}/admin/${adminId}`),
  toggleStatus: (id) => api.patch(`${config.ENDPOINTS.TAXI.ALL}/${id}/toggle-status`),
};

// Tours API methods
export const toursAPI = {
  getAll: () => api.get(config.ENDPOINTS.TOURS.ALL),
  getByCategory: (category) => api.get(`${config.ENDPOINTS.TOURS.BY_CATEGORY}/${category}`),
  getById: (id) => api.get(`${config.ENDPOINTS.TOURS.BY_ID}/${id}`),
  search: (query) => api.get(`${config.ENDPOINTS.TOURS.SEARCH}?q=${query}`),
  create: (data) => api.post(config.ENDPOINTS.TOURS.ALL, data),
  update: (id, data) => api.put(`${config.ENDPOINTS.TOURS.ALL}/${id}`, data),
  delete: (id) => api.delete(`${config.ENDPOINTS.TOURS.ALL}/${id}`),
  getAdminTours: (adminId) => api.get(`${config.ENDPOINTS.TOURS.ALL}/admin/${adminId}`),
  toggleStatus: (id) => api.patch(`${config.ENDPOINTS.TOURS.ALL}/${id}/toggle-status`),
};

// Bookings API methods
export const bookingsAPI = {
  create: (bookingData) => api.post(config.ENDPOINTS.BOOKINGS.CREATE, bookingData),
  getAll: () => api.get(config.ENDPOINTS.BOOKINGS.GET_ALL),
  getById: (id) => api.get(`${config.ENDPOINTS.BOOKINGS.GET_BY_ID}/${id}`),
  update: (id, bookingData) => api.patch(`${config.ENDPOINTS.BOOKINGS.UPDATE}/${id}`, bookingData),
  cancel: (id, phone) => api.delete(`${config.ENDPOINTS.BOOKINGS.CANCEL}/${id}?phone=${encodeURIComponent(phone)}`),
  getByCustomer: (phone) => api.get(`${config.ENDPOINTS.BOOKINGS.GET_ALL}/customer/${phone}`),
  getAdminCreated: () => api.get(`${config.ENDPOINTS.BOOKINGS.GET_ALL}/admin/created`),
  getAllAdminCreated: () => api.get(`${config.ENDPOINTS.BOOKINGS.GET_ALL}/admin/all-created`),
  getAdminServiceBookings: () => api.get(`${config.ENDPOINTS.BOOKINGS.GET_ALL}/admin/service-bookings`),
  getAdminTourBookings: () => api.get(`${config.ENDPOINTS.BOOKINGS.GET_ALL}/admin/tour-bookings`),
  getAdminTaxiBookings: () => api.get(`${config.ENDPOINTS.BOOKINGS.GET_ALL}/admin/taxi-bookings`),
  getTourBookings: (tourId) => api.get(`${config.ENDPOINTS.BOOKINGS.GET_ALL}/tour/${tourId}`),
  getTaxiBookings: (taxiId) => api.get(`${config.ENDPOINTS.BOOKINGS.GET_ALL}/taxi/${taxiId}`),
  getStats: () => api.get(`${config.ENDPOINTS.BOOKINGS.GET_ALL}/stats/overview`),
};

export default api;

