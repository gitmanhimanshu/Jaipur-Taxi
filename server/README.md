# ISG Taxi Server

A Node.js/Express backend API for taxi and tour booking services.

## CORS Configuration

This server is configured to **allow all origins** for maximum compatibility:

```javascript
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    // Allow all origins
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

This eliminates CORS errors when deploying frontend to different domains/platforms.

## Features

- 🚗 Taxi service management
- 🏛️ Tour package management
- 👤 User authentication and authorization
- 📝 Booking system
- 🛡️ Security with Helmet
- 📊 Request logging with Morgan
- 🔄 CORS enabled for all origins

## Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/isg-taxi

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Admin User
ADMIN_EMAIL=admin@isgtaxi.com
ADMIN_PASSWORD=admin123

# CORS (Optional - defaults to allow all)
CORS_ORIGIN=http://localhost:5173
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

### Taxi Services
- `GET /api/taxi` - Get all taxi services
- `GET /api/taxi/category/:category` - Get taxis by category
- `GET /api/taxi/:id` - Get taxi by ID
- `POST /api/taxi` - Create taxi service (Admin)
- `PUT /api/taxi/:id` - Update taxi service (Admin)
- `DELETE /api/taxi/:id` - Delete taxi service (Admin)
- `POST /api/taxi/calculate-fare` - Calculate fare

### Tour Packages
- `GET /api/tours` - Get all tour packages
- `GET /api/tours/category/:category` - Get tours by category
- `GET /api/tours/:id` - Get tour by ID
- `POST /api/tours` - Create tour package (Admin)
- `PUT /api/tours/:id` - Update tour package (Admin)
- `DELETE /api/tours/:id` - Delete tour package (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/:id` - Get booking by ID (Admin)
- `PATCH /api/bookings/:id` - Update booking (Admin)
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/customer/:phone` - Get customer bookings
- `GET /api/bookings/admin/service-bookings` - Get admin's service bookings
- `GET /api/bookings/admin/tour-bookings` - Get admin's tour bookings
- `GET /api/bookings/admin/taxi-bookings` - Get admin's taxi bookings

### Health Check
- `GET /api/health` - Server health check

## Database Models

- **User**: User authentication and profiles
- **Taxi**: Taxi service information
- **Tour**: Tour package information
- **Booking**: Booking records linking users, services, and admins

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Helmet for security headers
- Input validation and sanitization
- Rate limiting (recommended for production)
- CORS protection

## Deployment

### Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build` (if needed)
3. Add environment variables in Vercel dashboard

### Railway
1. Connect your GitHub repository
2. Set start command: `npm start`
3. Add environment variables

### Local Deployment
```bash
npm install
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
