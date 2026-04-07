# 🏗️ Server Architecture & File Structure

## 📁 Complete Directory Tree

```
Appliance Management/
│
├── SETUP.md                          # Detailed setup instructions
├── setup.bat                         # Automated setup script for Windows
│
├── Server/                           # Backend (Express + MongoDB)
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   └── serviceController.js     # Service management
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification & role check
│   │   └── validator.js             # Input validation
│   │
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Service.js               # Service schema
│   │   └── Booking.js               # Booking schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── serviceRoutes.js         # Service endpoints
│   │
│   ├── src/
│   │   └── server.js                # Main application entry
│   │
│   ├── utils/
│   │   ├── tokenUtils.js            # JWT helper functions
│   │   └── seeder.js                # Database seeding script
│   │
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── .gitignore                   # Git ignore rules
│   ├── package.json                 # Dependencies & scripts
│   └── README.md                    # Server documentation
│
└── Client/                           # Frontend (React + Vite)
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js     # Axios configuration
    │   │   ├── auth.api.js          # Auth API calls
    │   │   └── services.api.js      # Services API calls
    │   │
    │   ├── apps/
    │   │   ├── customer/            # Customer app
    │   │   │   ├── screens/
    │   │   │   │   ├── HomeScreen.jsx
    │   │   │   │   ├── BookingScreen.jsx
    │   │   │   │   ├── SummaryScreen.jsx
    │   │   │   │   └── ConfirmationScreen.jsx
    │   │   │   └── components/
    │   │   │       ├── ServiceCard.jsx
    │   │   │       ├── MapPicker.jsx
    │   │   │       ├── OTPInput.jsx
    │   │   │       └── PaymentOptions.jsx
    │   │   │
    │   │   └── landing/             # Landing page
    │   │       ├── pages/
    │   │       │   ├── HeroSection.jsx
    │   │       │   ├── ServicesSection.jsx
    │   │       │   ├── HowItWorksSection.jsx
    │   │       │   └── ContactSection.jsx
    │   │       └── components/
    │   │           ├── Navbar.jsx
    │   │           ├── LoginModal.jsx
    │   │           ├── SignupModal.jsx
    │   │           └── Footer.jsx
    │   │
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── authSlice.js     # Redux auth state
    │   │   │   └── bookingSlice.js  # Booking state
    │   │   └── index.js             # Redux store
    │   │
    │   ├── queries/
    │   │   ├── useAuth.js           # Auth queries
    │   │   └── useServices.js       # Service queries
    │   │
    │   └── router/
    │       ├── AppRouter.jsx        # Main router
    │       ├── LoginPage.jsx
    │       └── LandingPage.jsx
    │
    ├── .env                         # Client environment
    ├── .env.example                 # Environment template
    ├── package.json                 # Dependencies
    └── vite.config.js               # Vite configuration
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Signup/Login   │
│  (Client)       │
└──────┬──────────┘
       │ POST /api/auth/signup or /login
       ▼
┌─────────────────┐
│  AuthController │
│  - Validate     │
│  - Hash Password│
│  - Create User  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Generate JWT   │
│  Token          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Return Token   │
│  to Client      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Store in       │
│  localStorage   │
└─────────────────┘
```

---

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: 'customer' | 'technician' | 'branch-admin' | 'super-admin',
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: { latitude, longitude }
  },
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Service Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: 'cooling' | 'laundry' | 'kitchen' | 'electronics',
  price: Number,
  duration: Number (minutes),
  image: String (emoji),
  rating: Number (0-5),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection
```javascript
{
  _id: ObjectId,
  customer: ObjectId (ref: User),
  service: ObjectId (ref: Service),
  technician: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  alternatePhone: String,
  address: String,
  city: String,
  pincode: String,
  date: Date,
  timeSlot: String,
  notes: String,
  price: Number,
  paymentMethod: 'online' | 'cash',
  paymentStatus: 'pending' | 'paid' | 'failed',
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled',
  otpVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Request Flow

### 1. User Registration
```
Client → POST /api/auth/signup → Controller → Model → DB
                                      ↓
Client ← Token + User Data ← JWT Sign ← Validation
```

### 2. Get Services
```
Client → GET /api/services → Controller → Model → DB
                                   ↓
Client ← Services Array ← Query Result
```

### 3. Protected Route Access
```
Client → GET /api/auth/me + Bearer Token
              ↓
        Auth Middleware
              ↓
        Verify JWT → Extract User ID
              ↓
        Find User in DB
              ↓
        Return User Data
```

---

## 🛡️ Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcryptjs with salt rounds = 10 |
| **JWT Authentication** | jsonwebtoken with expiry |
| **Input Validation** | express-validator |
| **CORS Protection** | cors middleware |
| **Role-based Access** | Custom authorize middleware |
| **Token Storage** | localStorage (client-side) |

---

## 📦 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "msg": "Validation error",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

---

## 🎯 Key Features Implemented

### Backend ✅
- [x] Express.js server
- [x] MongoDB with Mongoose
- [x] JWT authentication
- [x] Password hashing
- [x] Role-based authorization
- [x] Input validation
- [x] CORS enabled
- [x] Error handling
- [x] Database seeding
- [x] RESTful API design

### Frontend ✅
- [x] React 19 with Vite
- [x] Modern UI with Tailwind CSS
- [x] Ant Design components
- [x] Redux state management
- [x] React Router navigation
- [x] Axios HTTP client
- [x] Responsive design
- [x] Multi-step forms
- [x] OTP verification
- [x] Payment options

---

## 🚀 Quick Commands

### Server
```bash
cd Server
npm install          # Install dependencies
npm run dev          # Start development server
npm run seed         # Seed database
npm start            # Start production server
```

### Client
```bash
cd Client
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 📝 Next Development Steps

1. **Booking Module**
   - Create booking controller
   - Add booking routes
   - Implement CRUD operations

2. **Technician Module**
   - Technician assignment logic
   - Job status updates
   - Real-time notifications

3. **Admin Dashboard**
   - Analytics endpoints
   - User management
   - Service management

4. **Payment Integration**
   - Razorpay/Stripe integration
   - Payment webhook handling
   - Receipt generation

---

**Architecture designed for scalability! 🚀**
