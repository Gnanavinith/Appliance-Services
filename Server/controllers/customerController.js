import Customer from '../models/Customer.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private/Customer
export const getMyProfile = async (req, res) => {
  try {
    let profile = await Customer.findOne({ user: req.user.id }).populate('user', 'name email phone address isVerified createdAt');

    if (!profile) {
      // Auto-create profile if doesn't exist
      profile = await Customer.create({ user: req.user.id });
      profile = await Customer.findById(profile._id).populate('user', 'name email phone address isVerified createdAt');
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private/Customer
export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, avatar, dateOfBirth, gender, preferredServices } = req.body;

    // Update user base fields
    if (name || phone) {
      await User.findByIdAndUpdate(req.user.id, { name, phone }, { new: true, runValidators: true });
    }

    // Update customer profile
    const profileFields = {};
    if (avatar) profileFields.avatar = avatar;
    if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
    if (gender !== undefined) profileFields.gender = gender;
    if (preferredServices) profileFields.preferredServices = preferredServices;
    profileFields.lastActiveAt = new Date();

    const profile = await Customer.findOneAndUpdate(
      { user: req.user.id },
      profileFields,
      { new: true, upsert: true }
    ).populate('user', 'name email phone address isVerified createdAt');

    res.json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add saved address
// @route   POST /api/customers/addresses
// @access  Private/Customer
export const addAddress = async (req, res) => {
  try {
    const { label, street, city, state, pincode, isDefault } = req.body;

    const profile = await Customer.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    if (isDefault) {
      profile.savedAddresses.forEach(addr => addr.isDefault = false);
    }

    profile.savedAddresses.push({ label, street, city, state, pincode, isDefault: isDefault || profile.savedAddresses.length === 0 });
    await profile.save();

    res.status(201).json({ success: true, message: 'Address added', data: profile.savedAddresses });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove saved address
// @route   DELETE /api/customers/addresses/:addressId
// @access  Private/Customer
export const removeAddress = async (req, res) => {
  try {
    const profile = await Customer.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.savedAddresses = profile.savedAddresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    await profile.save();

    res.json({ success: true, message: 'Address removed', data: profile.savedAddresses });
  } catch (error) {
    console.error('Remove address error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get customer dashboard stats
// @route   GET /api/customers/stats
// @access  Private/Customer
export const getMyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const [totalBookings, completedBookings, cancelledBookings, pendingBookings, recentBookings] = await Promise.all([
      Booking.countDocuments({ customer: userId }),
      Booking.countDocuments({ customer: userId, status: 'completed' }),
      Booking.countDocuments({ customer: userId, status: 'cancelled' }),
      Booking.countDocuments({ customer: userId, status: { $in: ['pending', 'confirmed', 'in-progress'] } }),
      Booking.find({ customer: userId }).populate('service', 'name category price image').sort({ createdAt: -1 }).limit(5),
    ]);

    const totalSpent = await Booking.aggregate([
      { $match: { customer: require('mongoose').Types.ObjectId.createFromHexString(userId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        totalSpent: totalSpent[0]?.total || 0,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── ADMIN-ONLY CUSTOMER MANAGEMENT ─────────────────────────────────────────

// @desc    Get all customers (admin)
// @route   GET /api/customers
// @access  Private/Admin
export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    let customers;
    if (search) {
      const users = await User.find({
        role: 'customer',
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      filter.user = { $in: users.map(u => u._id) };
    } else {
      const allCustomerUsers = await User.find({ role: 'customer' }).select('_id');
      filter.user = { $in: allCustomerUsers.map(u => u._id) };
    }

    customers = await Customer.find(filter)
      .populate('user', 'name email phone isVerified createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Customer.countDocuments(filter);

    res.json({
      success: true,
      data: customers,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get all customers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single customer by ID (admin)
// @route   GET /api/customers/:id
// @access  Private/Admin
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('user', 'name email phone address isVerified createdAt');

    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    const bookings = await Booking.find({ customer: customer.user._id })
      .populate('service', 'name category price')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: { ...customer.toObject(), bookings } });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle customer active status (admin)
// @route   PATCH /api/customers/:id/toggle-status
// @access  Private/Admin
export const toggleCustomerStatus = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    customer.isActive = !customer.isActive;
    await customer.save();

    res.json({ success: true, message: `Customer ${customer.isActive ? 'activated' : 'deactivated'}`, data: customer });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
