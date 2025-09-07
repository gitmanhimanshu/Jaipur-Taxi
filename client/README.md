# Jaipur Taxi - Client

This is the React frontend for the Jaipur Taxi application.

## Environment Setup

To configure the backend URL and other settings, create a `.env` file in the client directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit the `.env` file with your configuration:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=Jaipur Taxi
VITE_APP_VERSION=1.0.0
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Configuration

The app uses a centralized configuration system located in `src/config/config.js`. This file:

- Reads environment variables using Vite's `import.meta.env`
- Provides fallback values for development
- Centralizes all API endpoints and configuration

## API Integration

The app includes a comprehensive API service (`src/services/api.js`) that:

- Automatically handles authentication tokens
- Provides methods for all API endpoints
- Includes request/response interceptors for error handling
- Automatically redirects to login on authentication failures

## Available API Methods

### Authentication
- `authAPI.login(credentials)` - User login
- `authAPI.register(userData)` - User registration
- `authAPI.getProfile()` - Get user profile
- `authAPI.updateProfile(userData)` - Update user profile
- `authAPI.changePassword(passwordData)` - Change password

### Taxi Services
- `taxiAPI.getAll()` - Get all taxi options
- `taxiAPI.getByCategory(category)` - Get taxis by category
- `taxiAPI.getById(id)` - Get specific taxi
- `taxiAPI.calculateFare(fareData)` - Calculate fare

### Tour Packages
- `toursAPI.getAll()` - Get all tour packages
- `toursAPI.getByCategory(category)` - Get tours by category
- `toursAPI.getById(id)` - Get specific tour
- `toursAPI.search(query)` - Search tours

### Bookings
- `bookingsAPI.create(bookingData)` - Create booking
- `bookingsAPI.getAll()` - Get all bookings
- `bookingsAPI.getById(id)` - Get specific booking
- `bookingsAPI.update(id, bookingData)` - Update booking
- `bookingsAPI.cancel(id)` - Cancel booking

## Development

The app is built with:
- React 18
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for HTTP requests

## Notes

- All environment variables must be prefixed with `VITE_` to be accessible in the client
- The backend URL defaults to `http://localhost:5000` if not specified
- API endpoints are automatically prefixed with the configured base URL



