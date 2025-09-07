// Client configuration file
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ,
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Jaipur Taxi',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/me',
      UPDATE_PROFILE: '/api/auth/me',
      CHANGE_PASSWORD: '/api/auth/change-password'
    },
    TAXI: {
      ALL: '/api/taxi',
      BY_CATEGORY: '/api/taxi/category',
      BY_ID: '/api/taxi',
      CALCULATE_FARE: '/api/taxi/calculate-fare'
    },
    TOURS: {
      ALL: '/api/tours',
      BY_CATEGORY: '/api/tours/category',
      BY_ID: '/api/tours',
      SEARCH: '/api/tours/search'
    },
    BOOKINGS: {
      CREATE: '/api/bookings',
      GET_ALL: '/api/bookings',
      GET_BY_ID: '/api/bookings',
      UPDATE: '/api/bookings',
      CANCEL: '/api/bookings'
    }
  }
};

export default config;
