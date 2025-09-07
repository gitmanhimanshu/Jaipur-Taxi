const mongoose = require('mongoose');

// Subdocument for service details to avoid casting issues
const serviceDetailsSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  duration: { type: String },
  price: { type: String },
  category: { type: String },
  capacity: { type: Number }
}, { _id: false });

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    serviceType: { type: String, enum: ['taxi', 'tour'], required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId }, // Can reference Tour or Taxi
    serviceName: { type: String },
    passengers: { type: Number, default: 1 },
    distance: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    specialRequests: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    bookingNumber: { type: String, required: true, unique: true },
    createdBy: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // New fields for service bookings
    serviceAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created the service
    serviceDetails: { type: serviceDetailsSchema }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);


