import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      firstName,
      lastName,
      email,
      phone,
      alternatePhone,
      address,
      city,
      pincode,
      date,
      timeSlot,
      notes,
      paymentMethod,
    } = req.body;

    console.log('🔍 [BACKEND] Received booking request:');
    console.log('  - serviceId:', serviceId);
    console.log('  - serviceId type:', typeof serviceId);
    console.log('  - serviceId length:', serviceId?.length);
    console.log('  - Full body:', req.body);

    // Validate required fields
    if (!serviceId || !firstName || !lastName || !email || !phone || 
        !address || !city || !pincode || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Get service details
    console.log('🔍 [BACKEND] Looking up service with ID:', serviceId);
    let service = null;
    
    try {
      service = await Service.findById(serviceId);
      console.log('🔍 [BACKEND] findById result:', service ? service.name : 'null');
    } catch (error) {
      console.log('🔍 [BACKEND] findById failed - invalid ObjectId format');
      // Continue to name-based lookup
    }
    
    // If findById fails (e.g., slug ID like 'ac-service'), try finding by name pattern
    if (!service && typeof serviceId === 'string' && serviceId.length < 24) {
      console.log('🔍 [BACKEND] Standard ID lookup failed, trying name-based lookup...');
      // Convert slug to name pattern (e.g., 'tv-repair' -> /TV.*Repair/i or 'AC Repair & Service')
      const words = serviceId.split('-').map(word => {
        // Handle all-caps acronyms (AC, TV) vs normal words
        if (word.toUpperCase() === word && word.length <= 3) {
          return word.toUpperCase(); // Keep acronyms as-is
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      const namePattern = new RegExp(words.join('.*'), 'i');
      console.log('🔍 [BACKEND] Searching for name pattern:', namePattern);
      console.log('🔍 [BACKEND] Pattern words:', words);
      service = await Service.findOne({ name: namePattern });
      console.log('🔍 [BACKEND] Name-based lookup result:', service ? service.name : 'NOT FOUND');
    }
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found. Please select a valid service from the catalog.',
      });
    }

    // Create booking
    const booking = await Booking.create({
      customer: req.user.id,
      service: service._id, // Use the found service object's _id, not the string serviceId
      firstName,
      lastName,
      email,
      phone,
      alternatePhone,
      address,
      city,
      pincode,
      date,
      timeSlot,
      notes,
      price: service.price,
      paymentMethod: paymentMethod || 'cash',
    });

    // Populate service and customer details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('service', 'name description category');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking,
    });
  } catch (error) {
    console.error('❌ [BACKEND] Create booking error:', error);
    console.error('❌ [BACKEND] Error details:', error.message);
    console.error('❌ [BACKEND] Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking',
      error: error.message,
    });
  }
};

// @desc    Get all bookings (for admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      query.date = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      };
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('service', 'name category price')
      .populate('technician', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('service', 'name description category price duration')
      .populate('technician', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user has access to this booking
    if (
      booking.customer._id.toString() !== req.user.id &&
      (!req.user || req.user.role === 'customer')
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking',
    });
  }
};

// @desc    Get customer bookings
// @route   GET /api/bookings/customer/:customerId
// @access  Private
export const getCustomerBookings = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Check authorization
    if (customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these bookings',
      });
    }

    const query = { customer: customerId };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('service', 'name category price image')
      .populate('technician', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get customer bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
    });
  }
};

// @desc    Get technician bookings
// @route   GET /api/bookings/technician/:technicianId
// @access  Private
export const getTechnicianBookings = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { status, date, page = 1, limit = 10 } = req.query;

    const query = { technician: technicianId };
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      query.date = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      };
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name phone address')
      .populate('service', 'name category price')
      .sort({ date: 1, timeSlot: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get technician bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Allow updates only by customer (before confirmation) or admin/technician
    if (
      booking.customer.toString() !== req.user.id &&
      !['admin', 'branch-admin'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking',
      });
    }

    // Prevent updates if booking is already confirmed or completed
    if (['confirmed', 'completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update booking with status: ${booking.status}`,
      });
    }

    const updatedFields = {
      ...req.body,
      updatedAt: Date.now(),
    };

    // Remove protected fields
    delete updatedFields.customer;
    delete updatedFields.service;
    delete updatedFields.technician;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    )
      .populate('customer', 'name email phone')
      .populate('service', 'name category price')
      .populate('technician', 'name phone');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking',
    });
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (
      booking.customer.toString() !== req.user.id &&
      !['admin', 'branch-admin'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Can't cancel completed bookings
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    const cancelledBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('service', 'name category price')
      .populate('technician', 'name phone');

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: cancelledBooking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking',
    });
  }
};

// @desc    Confirm booking
// @route   PATCH /api/bookings/:id/confirm
// @access  Private/Admin/Branch-Admin
export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Only admin or branch-admin can confirm
    if (!['admin', 'branch-admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm bookings',
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    const confirmedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('service', 'name category price')
      .populate('technician', 'name phone');

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: confirmedBooking,
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while confirming booking',
    });
  }
};

// @desc    Complete booking
// @route   PATCH /api/bookings/:id/complete
// @access  Private/Technician
export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Only technician or admin can complete
    if (
      booking.technician.toString() !== req.user.id &&
      !['admin', 'branch-admin'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this booking',
      });
    }

    booking.status = 'completed';
    booking.paymentStatus = 'paid';
    await booking.save();

    const completedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('service', 'name category price')
      .populate('technician', 'name phone');

    res.json({
      success: true,
      message: 'Booking completed successfully',
      data: completedBooking,
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing booking',
    });
  }
};

// @desc    Assign technician to booking
// @route   PATCH /api/bookings/:id/assign-technician
// @access  Private/Admin/Branch-Admin
export const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: 'Technician ID is required',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Only admin or branch-admin can assign
    if (!['admin', 'branch-admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to assign technicians',
      });
    }

    booking.technician = technicianId;
    if (booking.status === 'pending') {
      booking.status = 'confirmed';
    }
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('service', 'name category price')
      .populate('technician', 'name phone email');

    res.json({
      success: true,
      message: 'Technician assigned successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Assign technician error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning technician',
    });
  }
};
