const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serve uploaded files
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./routes/auth');
const taxiRoutes = require('./routes/taxi');
const tourRoutes = require('./routes/tours');
const bookingRoutes = require('./routes/bookings');
const User = require('./models/User');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/taxi', taxiRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jaipur Taxi Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚗 Jaipur Taxi Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: MongoDB Atlas`);
});

// Ensure single admin exists
(async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return;
    let admin = await User.findOne({ email });
    if (!admin) {
      admin = await User.create({ name: 'Admin', email, phone: '9999999999', password, role: 'admin' });
      console.log('👑 Admin user created:', email);
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
      console.log('👑 Existing user promoted to admin:', email);
    }
  } catch (e) {
    console.error('Failed to ensure admin user:', e.message);
  }
})();
