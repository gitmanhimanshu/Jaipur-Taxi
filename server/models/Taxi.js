const mongoose = require('mongoose');

const taxiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide taxi service name'],
    trim: true,
    maxlength: [100, 'Taxi service name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide taxi service description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please provide taxi type'],
    enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Mini Bus', 'Bus', 'Tempo Traveller']
  },
  category: {
    type: String,
    required: [true, 'Please provide taxi category'],
    enum: ['city', 'outstation', 'airport', 'railway', 'local', 'intercity']
  },
  basePrice: {
    type: Number,
    required: [true, 'Please provide base price'],
    min: [0, 'Base price cannot be negative']
  },
  pricePerKm: {
    type: Number,
    required: [true, 'Please provide price per kilometer'],
    min: [0, 'Price per km cannot be negative']
  },
  pricePerHour: {
    type: Number,
    default: 0,
    min: [0, 'Price per hour cannot be negative']
  },
  minimumFare: {
    type: Number,
    default: 0,
    min: [0, 'Minimum fare cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide passenger capacity'],
    min: [1, 'Capacity must be at least 1'],
    max: [50, 'Capacity cannot exceed 50']
  },
  features: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: '/images/default-taxi.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  availableAreas: [{
    type: String,
    trim: true
  }],
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    default: 'Petrol'
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic'],
    default: 'Manual'
  },
  ac: {
    type: Boolean,
    default: true
  },
  driverIncluded: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better search performance
taxiSchema.index({ name: 'text', description: 'text', availableAreas: 'text' });
taxiSchema.index({ category: 1, isActive: 1 });
taxiSchema.index({ createdBy: 1 });
taxiSchema.index({ type: 1, category: 1 });

module.exports = mongoose.model('Taxi', taxiSchema);

