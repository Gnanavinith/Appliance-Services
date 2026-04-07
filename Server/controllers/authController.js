import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';
import { validate } from '../middleware/validator.js';

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = [
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ 
        $or: [{ email }, { phone }] 
      });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email or phone number',
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        phone,
        password,
        role: 'customer',
      });

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
      });
    }
  },
];

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = [
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Login attempt - Email:', email);

      // Find user by email and include password
      const user = await User.findOne({ email }).select('+password');
      console.log('👤 User found:', user ? `${user.name} (${user.role})` : 'NOT FOUND');

      if (!user) {
        console.log('❌ User not found with email:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      console.log('🔑 Password match:', isMatch);

      if (!isMatch) {
        console.log('❌ Password does not match');
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Generate token
      const token = generateToken(user._id);
      console.log('✅ Login successful for:', user.email);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
      });
    }
  },
];

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
