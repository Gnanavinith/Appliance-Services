import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  firstName: {
    type: String,
    required: [true, 'Please add first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add last name'],
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
  },
  alternatePhone: String,
  address: {
    type: String,
    required: [true, 'Please add address'],
  },
  city: {
    type: String,
    required: [true, 'Please add city'],
  },
  pincode: {
    type: String,
    required: [true, 'Please add pincode'],
  },
  date: {
    type: Date,
    required: [true, 'Please select a date'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Please select a time slot'],
  },
  notes: String,
  price: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cash'],
    default: 'cash',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
