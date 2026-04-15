import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Service from '../models/Service.js';

dotenv.config();

const services = [
  {
    name: 'AC Repair & Service',
    description: 'Complete AC maintenance and repair',
    category: 'cooling',
    price: 499,
    duration: 60,
    image: 'https://picsum.photos/id/237/200/300',
    rating: 4.8,
  },
  {
    name: 'Refrigerator Repair',
    description: 'Fix cooling issues, gas refill',
    category: 'cooling',
    price: 399,
    duration: 90,
    image: 'https://picsum.photos/id/237/200/300',
    rating: 4.7,
  },
  {
    name: 'Washing Machine Service',
    description: 'Front load & top load service',
    category: 'laundry',
    price: 349,
    duration: 120,
    image: 'https://picsum.photos/id/237/200/300',
    rating: 4.6,
  },
  {
    name: 'TV Repair',
    description: 'LED, LCD, Smart TV repair',
    category: 'electronics',
    price: 299,
    duration: 60,
    image: 'https://picsum.photos/id/237/200/300',
    rating: 4.5,
  },
  {
    name: 'Microwave Repair',
    description: 'All brands microwave servicing',
    category: 'kitchen',
    price: 249,
    duration: 45,
    image: 'https://picsum.photos/id/237/200/300',
    rating: 4.4,
  },
  {
    name: 'Geyser Installation',
    description: 'Installation and repair service',
    category: 'kitchen',
    price: 599,
    duration: 90,
    image: 'https://picsum.photos/id/237/200/300',
    rating: 4.9,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert services
    await Service.insertMany(services);
    console.log('📦 Services seeded successfully');

    // Create users for different roles
    const users = [
      {
        name: 'Super Admin',
        email: process.env.SUPER_ADMIN_EMAIL || 'admin@test.com',
        phone: '9876543210',
        password: process.env.SUPER_ADMIN_PASSWORD || 'admin123',
        role: 'super-admin',
        isVerified: true,
      },
      {
        name: 'Branch Admin',
        email: 'branch@test.com',
        phone: '9876543211',
        password: ' ',
        role: 'branch-admin',
        isVerified: true,
      },
      {
        name: 'Technician User',
        email: 'tech@test.com',
        phone: '9876543212',
        password: 'tech123',
        role: 'technician',
        isVerified: true,
        skills: ['AC Repair', 'Refrigerator Repair'],
      },
      {
        name: 'Customer User',
        email: 'customer@test.com',
        phone: '9876543213',
        password: 'customer123',
        role: 'customer',
        isVerified: true,
      },
    ];

    // Use create() instead of insertMany() to trigger pre-save hooks (password hashing)
    for (const userData of users) {
      await User.create(userData);
    }
    console.log('👤 Users created successfully');

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('═══════════════════════════════════════');
    console.log('SUPER ADMIN:');
    console.log(`  Email: ${process.env.SUPER_ADMIN_EMAIL || 'admin@test.com'}`);
    console.log(`  Password: ${process.env.SUPER_ADMIN_PASSWORD || 'admin123'}`);
    console.log('\nBRANCH ADMIN:');
    console.log('  Email: branch@test.com');
    console.log('  Password: branch123');
    console.log('\nTECHNICIAN:');
    console.log('  Email: tech@test.com');
    console.log('  Password: tech123');
    console.log('\nCUSTOMER:');
    console.log('  Email: customer@test.com');
    console.log('  Password: customer123');
    console.log('═══════════════════════════════════════');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
