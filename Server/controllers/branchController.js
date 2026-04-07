import Branch from '../models/Branch.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

// @desc    Create branch
// @route   POST /api/branches
// @access  Private/Super-Admin
export const createBranch = async (req, res) => {
  try {
    const { name, address, phone, email, manager, operatingHours, serviceAreas, isActive } = req.body;
    
    // Validate required fields
    if (!name || !phone || !address || !address.city || !address.pincode) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let managerUserId = null;

    // If manager credentials are provided, create a branch-admin user
    if (manager && manager.email && manager.password) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: manager.email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'A user with this email already exists' 
        });
      }

      // Clean phone number - remove any non-digit characters and limit to 10 digits
      let cleanPhone = manager.phone ? manager.phone.replace(/\D/g, '') : '';
      // Remove leading zero if present and longer than 10 digits
      if (cleanPhone.length > 10 && cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.substring(1);
      }
      // Fallback to branch phone if manager phone not provided
      if (!cleanPhone && phone) {
        cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length > 10 && cleanPhone.startsWith('0')) {
          cleanPhone = cleanPhone.substring(1);
        }
      }

      // Create the manager user
      const managerUser = await User.create({
        name: manager.name || name + ' Manager',
        email: manager.email,
        password: manager.password,
        phone: cleanPhone || '9999999999', // Default fallback if no valid phone
        role: 'branch-admin',
        isVerified: true,
      });

      managerUserId = managerUser._id;
      console.log('✅ Created manager user:', managerUser._id);
    }

    // Create the branch
    const branchData = {
      name,
      address,
      phone,
      email,
      operatingHours,
      serviceAreas,
      isActive,
    };

    if (managerUserId) {
      branchData.manager = managerUserId;
    }

    const branch = await Branch.create(branchData);
    
    // Populate manager info for response
    const populatedBranch = await Branch.findById(branch._id)
      .populate('manager', 'name email phone');

    console.log('✅ Branch created successfully:', branch._id);
    res.status(201).json({ 
      success: true, 
      message: 'Branch created successfully', 
      data: populatedBranch 
    });
  } catch (error) {
    console.error('❌ Create branch error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private/Admin
export const getBranches = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) filter.name = { $regex: search, $options: 'i' };

    const branches = await Branch.find(filter)
      .populate('manager', 'name email phone')
      .populate('technicians', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Branch.countDocuments(filter);

    res.json({ success: true, data: branches, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single branch
// @route   GET /api/branches/:id
// @access  Private
export const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
      .populate('manager', 'name email phone')
      .populate('technicians', 'name email phone');

    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });

    // Get branch stats
    const branchBookings = await Booking.countDocuments({ /* if branch assigned */ });
    res.json({ success: true, data: branch });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('manager', 'name email phone');

    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });

    res.json({ success: true, message: 'Branch updated', data: branch });
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private/Super-Admin
export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });

    res.json({ success: true, message: 'Branch deleted' });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add technician to branch
// @route   POST /api/branches/:id/technicians
// @access  Private/Admin
export const addTechnicianToBranch = async (req, res) => {
  try {
    const { technicianId } = req.body;
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });

    if (!branch.technicians.includes(technicianId)) {
      branch.technicians.push(technicianId);
      await branch.save();
    }

    const updatedBranch = await Branch.findById(branch._id).populate('technicians', 'name email phone');
    res.json({ success: true, message: 'Technician added to branch', data: updatedBranch });
  } catch (error) {
    console.error('Add technician error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove technician from branch
// @route   DELETE /api/branches/:id/technicians/:techId
// @access  Private/Admin
export const removeTechnicianFromBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });

    branch.technicians = branch.technicians.filter(t => t.toString() !== req.params.techId);
    await branch.save();

    res.json({ success: true, message: 'Technician removed from branch' });
  } catch (error) {
    console.error('Remove technician error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
