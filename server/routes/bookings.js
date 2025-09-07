const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Taxi = require('../models/Taxi');
const { protect, authorize } = require('../middleware/auth');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      serviceType, // 'taxi' or 'tour'
      serviceId,
      serviceName,
      passengers,
      distance,
      hours,
      totalAmount,
      specialRequests
    } = req.body;

    // Check if user is logged in (admin or regular user)
    const token = req.headers.authorization?.replace('Bearer ', '');
    let createdBy = 'user';
    let createdByUserId = null;
    
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const User = require('../models/User');
        const user = await User.findById(decoded.id);
        if (user) {
          createdBy = user.role === 'admin' ? 'admin' : 'user';
          createdByUserId = user._id;
        }
      } catch (e) {
        // Token invalid, continue as regular user
      }
    }

    // Fill sensible defaults instead of hard-failing
    const now = new Date();
    const defaultDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Prepare base fields with defaults
    let safeCustomerName = (customerName || '').toString().trim();
    let safeCustomerPhone = (customerPhone || '').toString().trim();
    let safePickupLocation = (pickupLocation || 'N/A').toString().trim();
    let safeDropLocation = (dropLocation || pickupLocation || 'N/A').toString().trim();
    let safePickupDate = (pickupDate || defaultDate).toString().trim();
    let safePickupTime = (pickupTime || defaultTime).toString().trim();
    let safeServiceType = (serviceType || '').toString().trim();
    let safeServiceId = serviceId;
    let safeServiceName = (serviceName || '').toString().trim();

    // Minimal validation: must have name, phone, serviceType, and either serviceId or serviceName
    const missingFields = [];
    if (!safeCustomerName) missingFields.push('customerName');
    if (!safeCustomerPhone) missingFields.push('customerPhone');
    if (!safeServiceType) missingFields.push('serviceType');
    if (!safeServiceId && !safeServiceName) missingFields.push('serviceId|serviceName');
    if (missingFields.length > 0) {
      console.warn('Create booking missing fields:', missingFields, 'rawBody:', req.body);
      return res.status(400).json({
        success: false,
        error: 'Missing minimal required fields',
        missing: missingFields
      });
    }

    // Resolve service when needed
    // If serviceId provided but invalid format, we'll try lookup by name as fallback
    let resolvedServiceId = null;
    let resolvedServiceName = safeServiceName;
    let isIdValid = safeServiceId && mongoose.Types.ObjectId.isValid(safeServiceId);

    // Get service details and admin info
    let serviceAdmin = null;
    let serviceDetails = null;
    
    if (safeServiceType === 'tour') {
      let tour = isIdValid ? await Tour.findById(safeServiceId) : null;
      // Fallback: try by name if id not found and serviceName provided
      if (!tour && resolvedServiceName) {
        tour = await Tour.findOne({ name: resolvedServiceName });
      }
      if (!tour) {
        return res.status(404).json({ success: false, error: 'Tour not found for provided serviceId' });
      }
      resolvedServiceId = tour._id;
      resolvedServiceName = tour.name;
      serviceAdmin = tour.createdBy;
      serviceDetails = {
        name: tour.name,
        type: tour.type,
        duration: tour.duration,
        price: tour.price,
        category: tour.category,
        capacity: tour.maxCapacity
      };
    } else if (safeServiceType === 'taxi') {
      let taxi = isIdValid ? await Taxi.findById(safeServiceId) : null;
      if (!taxi && resolvedServiceName) {
        taxi = await Taxi.findOne({ name: resolvedServiceName });
      }
      if (!taxi) {
        return res.status(404).json({ success: false, error: 'Taxi not found for provided serviceId' });
      }
      resolvedServiceId = taxi._id;
      resolvedServiceName = taxi.name;
      serviceAdmin = taxi.createdBy;
      serviceDetails = {
        name: taxi.name,
        type: taxi.type,
        duration: 'As per booking',
        price: `₹${taxi.pricePerKm}/km`,
        category: taxi.category,
        capacity: taxi.capacity
      };
    }

    const newBooking = {
      customerName: safeCustomerName,
      customerPhone: safeCustomerPhone,
      customerEmail,
      pickupLocation: safePickupLocation,
      dropLocation: safeDropLocation,
      pickupDate: safePickupDate,
      pickupTime: safePickupTime,
      serviceType: safeServiceType,
      serviceId: resolvedServiceId,
      serviceName: resolvedServiceName,
      passengers: passengers || 1,
      distance: distance || 0,
      hours: hours || 0,
      totalAmount: totalAmount || 0,
      specialRequests: specialRequests || '',
      status: 'pending',
      bookingNumber: `JT${Date.now()}${Math.floor(Math.random() * 1000)}`,
      createdBy,
      createdByUserId,
      serviceAdmin,
      serviceDetails
    };

    const created = await Booking.create(newBooking);

    res.status(201).json({
      success: true,
      data: created,
      message: 'Booking created successfully'
    });
  } catch (error) {
    // Log the actual error for debugging
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      details: error?.message || 'Unknown error'
    });
  }
});

// Get all bookings
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings, message: 'Bookings retrieved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve bookings' });
  }
});

// Get booking by ID
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking,
      message: 'Booking details retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve booking details'
    });
  }
});

// Update booking (status or other fields)
router.patch('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const booking = await Booking.findByIdAndUpdate(id, update, { new: true });
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: booking, message: 'Booking updated successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update booking'
    });
  }
});

// Cancel booking
// Customer can cancel their own booking by providing phone for verification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const phone = req.query.phone;
    const update = { status: 'cancelled' };
    let booking;
    if (phone) {
      booking = await Booking.findOneAndUpdate({ _id: id, customerPhone: phone }, update, { new: true });
    } else {
      // fallback for admin, requires token and role
      return res.status(400).json({ success: false, error: 'Phone is required to cancel booking' });
    }
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: booking, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking'
    });
  }
});

// Get bookings by customer phone
router.get('/customer/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const customerBookings = await Booking.find({ customerPhone: phone }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: customerBookings,
      message: 'Customer bookings retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve customer bookings'
    });
  }
});

// Get bookings by service type
router.get('/service/:type', protect, authorize('admin'), async (req, res) => {
  try {
    const { type } = req.params;
    const serviceBookings = await Booking.find({ serviceType: type }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: serviceBookings,
      message: `${type} bookings retrieved successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve service bookings'
    });
  }
});

// Get admin-created bookings (for admin to see their own bookings)
router.get('/admin/created', protect, authorize('admin'), async (req, res) => {
  try {
    const adminBookings = await Booking.find({ 
      createdBy: 'admin',
      createdByUserId: req.user.id 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: adminBookings,
      message: 'Admin-created bookings retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve admin-created bookings'
    });
  }
});

// Get all admin-created bookings (for super admin to see all admin bookings)
router.get('/admin/all-created', protect, authorize('admin'), async (req, res) => {
  try {
    const adminBookings = await Booking.find({ createdBy: 'admin' })
      .populate('createdByUserId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: adminBookings,
      message: 'All admin-created bookings retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve all admin-created bookings'
    });
  }
});

// Get service bookings for specific admin (bookings for services created by this admin)
router.get('/admin/service-bookings', protect, authorize('admin'), async (req, res) => {
  try {
    const serviceBookings = await Booking.find({ 
      serviceAdmin: req.user.id 
    })
    .populate('serviceId', 'name type duration price category')
    .populate('createdByUserId', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: serviceBookings,
      message: 'Service bookings for admin retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve service bookings for admin'
    });
  }
});

// Get tour bookings for specific admin (bookings for tours created by this admin)
router.get('/admin/tour-bookings', protect, authorize('admin'), async (req, res) => {
  try {
    const tourBookings = await Booking.find({ 
      serviceType: 'tour',
      serviceAdmin: req.user.id 
    })
    .populate('serviceId', 'name type duration price category')
    .populate('createdByUserId', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tourBookings,
      message: 'Tour bookings for admin retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tour bookings for admin'
    });
  }
});

// Get taxi bookings for specific admin (bookings for taxis created by this admin)
router.get('/admin/taxi-bookings', protect, authorize('admin'), async (req, res) => {
  try {
    const taxiBookings = await Booking.find({ 
      serviceType: 'taxi',
      serviceAdmin: req.user.id 
    })
    .populate('serviceId', 'name type pricePerKm category capacity')
    .populate('createdByUserId', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: taxiBookings,
      message: 'Taxi bookings for admin retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve taxi bookings for admin'
    });
  }
});

// Get tour bookings for specific tour
router.get('/tour/:tourId', protect, authorize('admin'), async (req, res) => {
  try {
    const { tourId } = req.params;
    
    // Check if the admin has permission to view this tour's bookings
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }
    
    // Check if user is the tour creator or super admin
    if (tour.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this tour\'s bookings'
      });
    }
    
    const tourBookings = await Booking.find({ 
      serviceType: 'tour',
      serviceId: tourId 
    })
    .populate('createdByUserId', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tourBookings,
      message: 'Tour bookings retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tour bookings'
    });
  }
});

// Get taxi bookings for specific taxi
router.get('/taxi/:taxiId', protect, authorize('admin'), async (req, res) => {
  try {
    const { taxiId } = req.params;
    
    // Check if the admin has permission to view this taxi's bookings
    const taxi = await Taxi.findById(taxiId);
    if (!taxi) {
      return res.status(404).json({
        success: false,
        error: 'Taxi service not found'
      });
    }
    
    // Check if user is the taxi creator or super admin
    if (taxi.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this taxi\'s bookings'
      });
    }
    
    const taxiBookings = await Booking.find({ 
      serviceType: 'taxi',
      serviceId: taxiId 
    })
    .populate('createdByUserId', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: taxiBookings,
      message: 'Taxi bookings retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve taxi bookings'
    });
  }
});

// Get booking statistics
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const taxiBookings = await Booking.countDocuments({ serviceType: 'taxi' });
    const tourBookings = await Booking.countDocuments({ serviceType: 'tour' });
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    
    res.json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        taxiBookings,
        tourBookings,
        totalRevenue: `₹${totalRevenue}`,
        averageRevenue: totalRevenue > 0 && completedBookings > 0 ? `₹${Math.round(totalRevenue / completedBookings)}` : '₹0'
      },
      message: 'Booking statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve booking statistics'
    });
  }
});

module.exports = router;

