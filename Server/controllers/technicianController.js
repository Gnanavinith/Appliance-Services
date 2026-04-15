import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Branch from '../models/Branch.js';
import Notification from '../models/Notification.js';

// @desc    Get all technicians
// @route   GET /api/technicians
// @access  Private/Admin
export const getAllTechnicians = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const filter = { role: 'technician' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const technicians = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    // Enrich with booking counts
    const enriched = await Promise.all(technicians.map(async (tech) => {
      const [totalJobs, completedJobs, activeJobs] = await Promise.all([
        Booking.countDocuments({ technician: tech._id }),
        Booking.countDocuments({ technician: tech._id, status: 'completed' }),
        Booking.countDocuments({ technician: tech._id, status: { $in: ['confirmed', 'in-progress'] } }),
      ]);
      return { ...tech.toObject(), totalJobs, completedJobs, activeJobs };
    }));

    res.json({
      success: true,
      data: enriched,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get technicians error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get technician by ID
// @route   GET /api/technicians/:id
// @access  Private
export const getTechnicianById = async (req, res) => {
  try {
    const tech = await User.findOne({ _id: req.params.id, role: 'technician' }).select('-password');
    if (!tech) return res.status(404).json({ success: false, message: 'Technician not found' });

    const [totalJobs, completedJobs, activeJobs, todayJobs] = await Promise.all([
      Booking.countDocuments({ technician: tech._id }),
      Booking.countDocuments({ technician: tech._id, status: 'completed' }),
      Booking.countDocuments({ technician: tech._id, status: { $in: ['confirmed', 'in-progress'] } }),
      Booking.countDocuments({
        technician: tech._id,
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
    ]);

    const recentBookings = await Booking.find({ technician: tech._id })
      .populate('customer', 'name phone')
      .populate('service', 'name category')
      .sort({ date: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { ...tech.toObject(), totalJobs, completedJobs, activeJobs, todayJobs, recentBookings },
    });
  } catch (error) {
    console.error('Get technician error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create technician (admin)
// @route   POST /api/technicians
// @access  Private/Admin
export const createTechnician = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email or phone' });
    }

    const technician = await User.create({ name, email, phone, password, address, role: 'technician' });
    const result = await User.findById(technician._id).select('-password');

    res.status(201).json({ success: true, message: 'Technician created', data: result });
  } catch (error) {
    console.error('Create technician error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update technician
// @route   PUT /api/technicians/:id
// @access  Private/Admin
export const updateTechnician = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const tech = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'technician' },
      { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    if (!tech) return res.status(404).json({ success: false, message: 'Technician not found' });

    res.json({ success: true, message: 'Technician updated', data: tech });
  } catch (error) {
    console.error('Update technician error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete technician
// @route   DELETE /api/technicians/:id
// @access  Private/Super-Admin
export const deleteTechnician = async (req, res) => {
  try {
    const tech = await User.findOneAndDelete({ _id: req.params.id, role: 'technician' });
    if (!tech) return res.status(404).json({ success: false, message: 'Technician not found' });

    // Remove from branches
    await Branch.updateMany({ technicians: req.params.id }, { $pull: { technicians: req.params.id } });

    res.json({ success: true, message: 'Technician deleted' });
  } catch (error) {
    console.error('Delete technician error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get my jobs (technician)
// @route   GET /api/technicians/my-jobs
// @access  Private/Technician
export const getMyJobs = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = { technician: req.user.id };
    if (status) filter.status = status;
    if (date) {
      filter.date = {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
      };
    }

    const jobs = await Booking.find(filter)
      .populate('customer', 'name email phone')
      .populate('service', 'name category price duration')
      .sort({ date: 1, timeSlot: 1 });

    const [todayCount, completedCount, pendingCount] = await Promise.all([
      Booking.countDocuments({
        technician: req.user.id,
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Booking.countDocuments({ technician: req.user.id, status: 'completed' }),
      Booking.countDocuments({ technician: req.user.id, status: { $in: ['confirmed', 'in-progress'] } }),
    ]);

    res.json({ success: true, data: jobs, stats: { todayCount, completedCount, pendingCount } });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update job status (technician)
// @route   PATCH /api/technicians/jobs/:bookingId/status
// @access  Private/Technician
export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['in-progress', 'completed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findOne({ _id: req.params.bookingId, technician: req.user.id })
      .populate('customer', 'name email')
      .populate('service', 'name');
    
    if (!booking) return res.status(404).json({ success: false, message: 'Job not found' });

    booking.status = status;
    if (status === 'completed') booking.paymentStatus = 'paid';
    await booking.save();

    // Create notification for customer
    let notificationTitle, notificationMessage;
    const serviceName = booking.service?.name || 'appliance service';
    const technicianName = req.user.name || 'Technician';
    
    if (status === 'in-progress') {
      notificationTitle = 'Technician Started Your Job';
      notificationMessage = `Good news! ${technicianName} has started working on your ${serviceName}. They are on their way or already at your location.`;
    } else if (status === 'completed') {
      notificationTitle = 'Service Completed';
      notificationMessage = `Your ${serviceName} has been completed successfully by ${technicianName}. Thank you for using our service!`;
    }

    // Only create notification if customer exists
    if (booking.customer?._id) {
      await Notification.create({
        recipient: booking.customer._id,
        title: notificationTitle,
        message: notificationMessage,
        type: 'technician',
        booking: booking._id,
        actionUrl: `/customer/bookings/${booking._id}`,
      });
    } else {
      console.warn('⚠️ No customer found for booking:', booking._id);
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name phone')
      .populate('service', 'name category');

    res.json({ success: true, message: `Job marked as ${status}`, data: updatedBooking });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
