const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Taxi = require('../models/Taxi');

// Get all taxi options
router.get('/', async (req, res) => {
  try {
    const taxis = await Taxi.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: taxis,
      message: 'Taxi options retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching taxis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve taxi options'
    });
  }
});

// Get taxi by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const taxis = await Taxi.find({ 
      category: category.toLowerCase(),
      isActive: true 
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: taxis,
      message: `Taxi options for ${category} category`
    });
  } catch (error) {
    console.error('Error fetching taxis by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve taxi options by category'
    });
  }
});

// Get taxi by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const taxi = await Taxi.findById(id)
      .populate('createdBy', 'name email phone');
    
    if (!taxi || !taxi.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Taxi not found'
      });
    }
    
    res.json({
      success: true,
      data: taxi,
      message: 'Taxi details retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching taxi:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve taxi details'
    });
  }
});

// Calculate fare
router.post('/calculate-fare', async (req, res) => {
  try {
    const { taxiId, distance, hours } = req.body;
    
    if (!taxiId || !distance) {
      return res.status(400).json({
        success: false,
        error: 'Taxi ID and distance are required'
      });
    }
    
    const taxi = await Taxi.findById(taxiId);
    if (!taxi || !taxi.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Taxi not found'
      });
    }
    
    const baseFare = taxi.pricePerKm * distance;
    const hourlyCharge = hours ? taxi.pricePerHour * hours : 0;
    const totalFare = Math.max(baseFare + hourlyCharge, taxi.minimumFare);
    
    res.json({
      success: true,
      data: {
        taxi: taxi.name,
        distance: `${distance} km`,
        hours: hours || 0,
        baseFare: `₹${baseFare}`,
        hourlyCharge: `₹${hourlyCharge}`,
        minimumFare: `₹${taxi.minimumFare}`,
        totalFare: `₹${totalFare}`,
        breakdown: {
          perKm: `₹${taxi.pricePerKm}`,
          perHour: `₹${taxi.pricePerHour}`,
          baseFare,
          hourlyCharge,
          minimumFare: taxi.minimumFare,
          totalFare
        }
      },
      message: 'Fare calculated successfully'
    });
  } catch (error) {
    console.error('Error calculating fare:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate fare'
    });
  }
});

// Get taxis created by specific admin
router.get('/admin/:adminId', protect, authorize('admin'), async (req, res) => {
  try {
    const { adminId } = req.params;
    const taxis = await Taxi.find({ createdBy: adminId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: taxis,
      message: 'Admin taxis retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching admin taxis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve admin taxis'
    });
  }
});

// Admin CRUD operations
// Create new taxi service
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      category,
      basePrice,
      pricePerKm,
      pricePerHour,
      minimumFare,
      capacity,
      features,
      image,
      availableAreas,
      fuelType,
      transmission,
      ac,
      driverIncluded,
      tags
    } = req.body;
    
    const taxiData = {
      name,
      description,
      type,
      category,
      basePrice: basePrice || 0,
      pricePerKm,
      pricePerHour: pricePerHour || 0,
      minimumFare: minimumFare || 0,
      capacity,
      features: features || ['Driver', 'Fuel', 'Water', 'Parking', 'Toll-Tax'],
      image: image || '/images/default-taxi.jpg',
      availableAreas: availableAreas || [],
      fuelType: fuelType || 'Petrol',
      transmission: transmission || 'Manual',
      ac: ac !== undefined ? ac : true,
      driverIncluded: driverIncluded !== undefined ? driverIncluded : true,
      tags: tags || [],
      createdBy: req.user.id
    };
    
    const newTaxi = await Taxi.create(taxiData);
    await newTaxi.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      data: newTaxi,
      message: 'Taxi service created successfully'
    });
  } catch (error) {
    console.error('Error creating taxi:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create taxi service'
    });
  }
});

// Update taxi service
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if taxi exists and user has permission to update
    const existingTaxi = await Taxi.findById(id);
    if (!existingTaxi) {
      return res.status(404).json({
        success: false,
        error: 'Taxi service not found'
      });
    }
    
    // Check if user is the creator or super admin
    if (existingTaxi.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this taxi service'
      });
    }
    
    const updatedTaxi = await Taxi.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: updatedTaxi,
      message: 'Taxi service updated successfully'
    });
  } catch (error) {
    console.error('Error updating taxi:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update taxi service'
    });
  }
});

// Delete taxi service (soft delete)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if taxi exists and user has permission to delete
    const existingTaxi = await Taxi.findById(id);
    if (!existingTaxi) {
      return res.status(404).json({
        success: false,
        error: 'Taxi service not found'
      });
    }
    
    // Check if user is the creator or super admin
    if (existingTaxi.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this taxi service'
      });
    }
    
    // Soft delete by setting isActive to false
    await Taxi.findByIdAndUpdate(id, { isActive: false });
    
    res.json({
      success: true,
      message: 'Taxi service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting taxi:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete taxi service'
    });
  }
});

// Toggle taxi status (active/inactive)
router.patch('/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingTaxi = await Taxi.findById(id);
    if (!existingTaxi) {
      return res.status(404).json({
        success: false,
        error: 'Taxi service not found'
      });
    }
    
    // Check if user is the creator or super admin
    if (existingTaxi.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this taxi service'
      });
    }
    
    const updatedTaxi = await Taxi.findByIdAndUpdate(
      id,
      { isActive: !existingTaxi.isActive },
      { new: true }
    ).populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: updatedTaxi,
      message: `Taxi service ${updatedTaxi.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling taxi status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update taxi status'
    });
  }
});

module.exports = router;