import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true,
  },
  code: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  phone: {
    type: String,
    required: [true, 'Branch phone is required'],
  },
  email: {
    type: String,
    lowercase: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  technicians: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  coverImage: {
    type: String,
    default: 'https://picsum.photos/seed/branch1/800/400',
  },
  operatingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
  },
  serviceAreas: [String], // list of cities/pincodes served
  totalBookings: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Auto-generate branch code
branchSchema.pre('save', function(next) {
  if (!this.code) {
    const cityPart = this.address.city.substring(0, 3).toUpperCase();
    const randPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.code = `BR-${cityPart}-${randPart}`;
  }
  next();
});

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
