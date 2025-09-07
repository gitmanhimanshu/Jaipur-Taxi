const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide tour name'],
    trim: true,
    maxlength: [100, 'Tour name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide tour description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please provide tour type'],
    enum: ['1 Day Tour', '2 Days / 1 Night', '3 Days / 2 Nights', '4 Nights / 5 Days', '6 Nights / 7 Days', '7 Nights / 8 Days', '8 Night / 9 Days', '9 Nights / 10 Days', 'Custom']
  },
  duration: {
    type: String,
    required: [true, 'Please provide tour duration'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Please provide tour price'],
    default: 'On Request'
  },
  originalPrice: {
    type: String,
    default: null
  },
  discount: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: [true, 'Please provide tour category'],
    enum: ['religious', 'city', 'multi-city', 'adventure', 'cultural', 'wildlife']
  },
  image: {
    type: String,
    default: '/images/default-tour.jpg'
  },
  features: [{
    type: String,
    trim: true
  }],
  inclusions: [{
    type: String,
    trim: true
  }],
  places: [{
    type: String,
    trim: true
  }],
  customizable: {
    type: Boolean,
    default: true
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
  maxCapacity: {
    type: Number,
    default: 50
  },
  minCapacity: {
    type: Number,
    default: 1
  },
  availableDates: [{
    date: Date,
    availableSlots: Number,
    price: String
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better search performance
tourSchema.index({ name: 'text', description: 'text', places: 'text' });
tourSchema.index({ category: 1, isActive: 1 });
tourSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Tour', tourSchema);
