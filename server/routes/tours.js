const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Tour = require('../models/Tour');

// Get all tour packages
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tours,
      message: 'Tour packages retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tour packages'
    });
  }
});

// Get tours by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const tours = await Tour.find({ 
      category: category.toLowerCase(),
      isActive: true 
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tours,
      message: `Tour packages for ${category} category`
    });
  } catch (error) {
    console.error('Error fetching tours by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tour packages by category'
    });
  }
});

// Get tour by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id)
      .populate('createdBy', 'name email phone');
    
    if (!tour || !tour.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Tour package not found'
      });
    }
    
    res.json({
      success: true,
      data: tour,
      message: 'Tour package details retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tour package details'
    });
  }
});

// Search tours by destination
router.get('/search/:destination', async (req, res) => {
  try {
    const { destination } = req.params;
    const searchTerm = destination.toLowerCase();
    
    const tours = await Tour.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { places: { $in: [new RegExp(searchTerm, 'i')] } }
          ]
        }
      ]
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tours,
      message: `Search results for ${destination}`
    });
  } catch (error) {
    console.error('Error searching tours:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search tour packages'
    });
  }
});

// Get tours created by specific admin
router.get('/admin/:adminId', protect, authorize('admin'), async (req, res) => {
  try {
    const { adminId } = req.params;
    const tours = await Tour.find({ createdBy: adminId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tours,
      message: 'Admin tours retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching admin tours:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve admin tours'
    });
  }
});

// Admin CRUD operations
// Create new tour package
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      duration,
      price,
      originalPrice,
      discount,
      category,
      image,
      features,
      inclusions,
      places,
      customizable,
      maxCapacity,
      minCapacity,
      tags
    } = req.body;
    
    const tourData = {
      name,
      description,
      type,
      duration,
      price: price || 'On Request',
      originalPrice,
      discount,
      category,
      image: image || '/images/default-tour.jpg',
      features: features || ['Sightseeing', 'Transfers', 'Driver', 'Fuel', 'Water'],
      inclusions: inclusions || [],
      places: places || [],
      customizable: customizable !== undefined ? customizable : true,
      maxCapacity: maxCapacity || 50,
      minCapacity: minCapacity || 1,
      tags: tags || [],
      createdBy: req.user.id
    };
    
    const newTour = await Tour.create(tourData);
    await newTour.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      data: newTour,
      message: 'Tour package created successfully'
    });
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create tour package'
    });
  }
});

// Update tour package
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if tour exists and user has permission to update
    const existingTour = await Tour.findById(id);
    if (!existingTour) {
      return res.status(404).json({
        success: false,
        error: 'Tour package not found'
      });
    }
    
    // Check if user is the creator or super admin
    if (existingTour.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this tour'
      });
    }
    
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: updatedTour,
      message: 'Tour package updated successfully'
    });
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update tour package'
    });
  }
});

// Delete tour package (soft delete)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if tour exists and user has permission to delete
    const existingTour = await Tour.findById(id);
    if (!existingTour) {
      return res.status(404).json({
        success: false,
        error: 'Tour package not found'
      });
    }
    
    // Check if user is the creator or super admin
    if (existingTour.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this tour'
      });
    }
    
    // Soft delete by setting isActive to false
    await Tour.findByIdAndUpdate(id, { isActive: false });
    
    res.json({
      success: true,
      message: 'Tour package deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete tour package'
    });
  }
});

// Toggle tour status (active/inactive)
router.patch('/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingTour = await Tour.findById(id);
    if (!existingTour) {
      return res.status(404).json({
        success: false,
        error: 'Tour package not found'
      });
    }
    
    // Check if user is the creator or super admin
    if (existingTour.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this tour'
      });
    }
    
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { isActive: !existingTour.isActive },
      { new: true }
    ).populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: updatedTour,
      message: `Tour package ${updatedTour.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling tour status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update tour status'
    });
  }
});

module.exports = router;