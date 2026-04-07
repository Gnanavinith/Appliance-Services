# 🚀 Complete Setup Guide - Appliance Management System

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) installed
- **MongoDB** installed and running
- **Git** (optional, for version control)

---

## 📁 Project Structure

```
Appliance Management/
├── Client/          # React + Vite Frontend
└── Server/          # Express + MongoDB Backend
```

---

## 🔧 Backend Setup (Server)

### Step 1: Navigate to Server Directory

```bash
cd "c:\Users\ADMIN\Desktop\Appliance Management\Server"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- morgan
- nodemon (dev dependency)

### Step 3: Configure Environment Variables

The `.env` file is already created with these defaults:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Appliances
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

⚠️ **Important**: Change `JWT_SECRET` in production!

### Step 4: Start MongoDB

**On Windows:**
```bash
mongod
```

**On Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Step 5: Seed Database (First Time Only)

This populates the database with:
- 6 pre-defined services (AC, Refrigerator, etc.)
- 1 admin user for testing

```bash
npm run seed
```

**Expected Output:**
```
✅ MongoDB Connected
🗑️  Cleared existing data
📦 Services seeded successfully
👤 Admin user created

✅ Seeding completed successfully!

Login credentials:
Email: admin@example.com
Password: password123
```

### Step 6: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000 in development mode
```

---

## 💻 Frontend Setup (Client)

### Step 1: Navigate to Client Directory

```bash
cd "c:\Users\ADMIN\Desktop\Appliance Management\Client"
```

### Step 2: Install Dependencies (if not already done)

```bash
npm install
```

### Step 3: Configure Environment Variables

The `.env` file is already created:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start the Development Server

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎯 Testing the Application

### 1. Open Your Browser

Navigate to: `http://localhost:5173/`

### 2. Test Login

Use the admin account created during seeding:
- **Email:** `admin@example.com`
- **Password:** `password123`

### 3. Test Signup

Create a new customer account:
- Click "Sign up free"
- Fill in the registration form
- Submit

### 4. Browse Services

After login, you should see:
- AC Repair & Service (₹499)
- Refrigerator Repair (₹399)
- Washing Machine Service (₹349)
- TV Repair (₹299)
- Microwave Repair (₹249)
- Geyser Installation (₹599)

---

## 🔍 API Testing

### Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Get Services

```bash
curl http://localhost:5000/api/services
```

**Expected Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "...",
      "name": "AC Repair & Service",
      "price": 499,
      ...
    }
  ]
}
```

### Test Login API

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "super-admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Start MongoDB: `mongod`
2. Check if MongoDB is running on port 27017
3. Verify `MONGODB_URI` in `.env`

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

Or change the port in Server/.env:
```env
PORT=5001
```

### Client Can't Connect to Server

**Solution:**
1. Ensure server is running (`npm run dev`)
2. Check `VITE_API_URL` in Client/.env
3. Clear browser cache and restart
4. Check browser console for CORS errors

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
npm install
```

---

## 📝 Default Credentials

After running `npm run seed`, you can use:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | super-admin |

---

## 🎨 Features Implemented

### Backend ✅
- [x] User authentication (signup/login)
- [x] JWT token generation
- [x] Password hashing
- [x] Role-based access control
- [x] Service management
- [x] Booking model
- [x] RESTful API structure

### Frontend ✅
- [x] Landing page
- [x] Service selection
- [x] Multi-step booking form
- [x] OTP verification
- [x] Payment options
- [x] Booking confirmation
- [x] Responsive design

---

## 📡 API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service

---

## 🚀 Next Steps

1. **Add More Features:**
   - Booking CRUD operations
   - Technician assignment
   - Real-time notifications
   - Payment gateway integration

2. **Improve Security:**
   - Rate limiting
   - Input sanitization
   - HTTPS in production
   - Environment-specific configs

3. **Deploy:**
   - Backend: Heroku, Railway, or AWS
   - Frontend: Vercel, Netlify
   - Database: MongoDB Atlas

---

## 📄 License

ISC

---

## 💡 Tips

- Always run both server and client for full functionality
- Use Postman or Thunder Client for API testing
- Keep MongoDB running in the background
- Use `npm run dev` for development (auto-reload)
- Clear browser cache if facing issues

---

**Happy Coding! 🎉**
