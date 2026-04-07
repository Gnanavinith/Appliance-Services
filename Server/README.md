# Appliances Server

Backend server for Appliance Management System built with Express.js and MongoDB.

## 🚀 Features

- User Authentication (Signup/Login)
- JWT Token-based authorization
- Role-based access control
- Service management
- Booking system
- RESTful API

## 📁 Project Structure

```
Server/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── src/             # Application entry point
├── utils/           # Utility functions
└── .env            # Environment variables
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd Server
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with default values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Appliances
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

### 4. Seed Database (First Time Only)

Populate the database with initial services and admin user:

```bash
npm run seed
```

This will create:
- 6 pre-defined services
- Admin user (email: `admin@example.com`, password: `password123`)

### 5. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/api/auth/signup` | Register new user | No |
| POST   | `/api/auth/login` | Login user | No |
| GET    | `/api/auth/me` | Get current user | Yes |

### Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/api/services` | Get all services | No |
| GET    | `/api/services/:id` | Get single service | No |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/api/bookings` | Create new booking | Yes |
| GET    | `/api/bookings` | Get all bookings (Admin) | Yes (Admin) |
| GET    | `/api/bookings/:id` | Get single booking | Yes |
| GET    | `/api/bookings/customer/:id` | Get customer bookings | Yes |
| GET    | `/api/bookings/technician/:id` | Get technician bookings | Yes |
| PUT    | `/api/bookings/:id` | Update booking | Yes |
| PATCH  | `/api/bookings/:id/cancel` | Cancel booking | Yes |
| PATCH  | `/api/bookings/:id/confirm` | Confirm booking | Yes (Admin) |
| PATCH  | `/api/bookings/:id/complete` | Complete booking | Yes (Tech/Admin) |
| PATCH  | `/api/bookings/:id/assign-technician` | Assign technician | Yes (Admin) |

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Example Requests

### Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Get Services

```bash
curl http://localhost:5000/api/services
```

### Create Booking

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "serviceId": "SERVICE_ID_HERE",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123, Main Street",
    "city": "Mumbai",
    "pincode": "400001",
    "date": "2024-01-15",
    "timeSlot": "09:00 AM - 11:00 AM",
    "paymentMethod": "cash"
  }'
```

## 🗄️ Database Models

### User
- name, email, phone
- password (hashed)
- role (customer/technician/branch-admin/super-admin)
- address

### Service
- name, description
- category, price
- duration, rating
- image

### Booking
- customer, service, technician
- address, date, timeSlot
- price, payment method
- status

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

### Module Not Found
- Run `npm install` to install dependencies

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **morgan** - HTTP request logger

## 🔒 Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting for auth endpoints
- Validate all user inputs

## 📄 License

ISC
