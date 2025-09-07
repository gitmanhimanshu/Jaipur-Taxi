# 🚗 Jaipur Taxi Clone

A modern, responsive clone of the Jaipur Taxi website built with React, Node.js, and MongoDB. This project features a beautiful UI with the same functionality as the original website, including taxi booking, tour packages, and user authentication.

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **User Authentication**: Complete login/signup system with JWT tokens
- **Taxi Services**: Browse and book different types of vehicles
- **Tour Packages**: Explore Rajasthan tour packages
- **Booking System**: Complete booking management system
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas
- **Responsive Design**: Works perfectly on all devices
- **Real-time Updates**: Dynamic content updates and form validation

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd jaipur-taxi-clone
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

### 3. Environment Setup

#### Server Environment
Create a `.env` file in the `server` folder:
```bash
cd server
cp env.example .env
```

Edit the `.env` file with your MongoDB connection string:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://himanshuprpwebs_db_user:qEiFRfukNYlU9sJa@cluster0.qavrdcs.mongodb.net/jaipur_taxi
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
```

**Important**: Replace the JWT_SECRET with a strong, unique secret key!

### 4. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

This will start both the server (port 5000) and client (port 5173) simultaneously.

#### Individual Mode
```bash
# Start server only
npm run server

# Start client only
npm run client
```

#### Production Mode
```bash
# Build the client
npm run build

# Start production server
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📱 Available Routes

### Frontend Routes
- `/` - Home page
- `/login` - User login
- `/signup` - User registration
- `/taxi-services` - Taxi services listing
- `/tour-packages` - Tour packages
- `/booking` - Booking form
- `/about` - About page
- `/contact` - Contact page

### Backend API Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/taxi` - Get all taxi options
- `GET /api/tours` - Get all tour packages
- `POST /api/bookings` - Create booking

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register**: Create a new account with name, email, phone, and password
2. **Login**: Sign in with email and password
3. **Protected Routes**: Access user-specific features
4. **Token Storage**: JWT tokens are stored in localStorage

### Demo Account
For testing purposes, you can use:
- **Email**: demo@jaipurtaxi.com
- **Password**: demo123

## 🗄️ Database Schema

### User Model
- Basic info (name, email, phone, password)
- Role-based access (user, admin)
- Profile preferences and address
- Timestamps for creation and updates

### Taxi Model
- Vehicle details (name, type, capacity)
- Pricing information
- Features and amenities
- Category classification

### Tour Package Model
- Package details and duration
- Pricing and discounts
- Included services
- Destination information

### Booking Model
- Customer information
- Service details
- Pickup/drop locations
- Status tracking

## 🎨 Customization

### Colors
The application uses a custom color palette defined in `tailwind.config.js`:
- **Primary**: Red tones (#ef4444, #dc2626, etc.)
- **Secondary**: Gray tones (#64748b, #475569, etc.)
- **Accent**: Orange tones (#f59e0b, #d97706, etc.)

### Styling
- Custom CSS classes in `src/index.css`
- Responsive design with Tailwind breakpoints
- Smooth transitions and hover effects

## 📱 Responsive Design

The application is fully responsive and works on:
- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large screens**: 1280px and up

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start both client and server
npm run server       # Start server only
npm run client       # Start client only

# Production
npm run build        # Build client for production
npm start           # Start production server

# Utilities
npm run install-all  # Install all dependencies
npm run lint         # Run ESLint
```

## 🚨 Important Notes

1. **Environment Variables**: Always keep your `.env` file secure and never commit it to version control
2. **JWT Secret**: Use a strong, unique JWT secret in production
3. **MongoDB**: The current setup uses MongoDB Atlas. Ensure your IP is whitelisted
4. **CORS**: The server is configured to accept requests from the client only

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change the port in `.env` file
   - Kill processes using the ports

2. **MongoDB Connection Failed**
   - Check your connection string
   - Verify IP whitelist in MongoDB Atlas
   - Check network connectivity

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Authentication Issues**
   - Check JWT secret configuration
   - Verify token expiration settings
   - Check localStorage for token

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- **Phone**: +91-99500-00669
- **Email**: booking.jaipurtour@gmail.com
- **Address**: S-229, Unnati Tower, Vidhyadhar Nagar, Jaipur, Rajasthan

## 🎯 Future Enhancements

- [ ] Real-time booking updates
- [ ] Payment gateway integration
- [ ] Driver app integration
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app development

---

**Happy Coding! 🚀**



