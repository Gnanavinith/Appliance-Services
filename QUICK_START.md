# 🚀 Quick Start - Booking Module

## 5-Minute Setup

### 1️⃣ Start Services (3 terminals)

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd Server
npm run dev
# ✅ Running on http://localhost:5000
```

**Terminal 3 - Frontend:**
```bash
cd Client
npm run dev
# ✅ Running on http://localhost:5173
```

---

### 2️⃣ Test Booking Creation (UI)

1. **Open Browser**: http://localhost:5173
2. **Login**: 
   - Email: `admin@example.com`
   - Password: `password123`
3. **Select Service**: Click "Book Now" on any service
4. **Fill Form**:
   - Name, Email, Phone
   - Address, City, Pincode
   - Date, Time Slot
   - Payment: Cash
5. **Summary Page**: Review details
6. **OTP**: Enter any 4 digits (e.g., `1234`)
7. **Confirm**: Click "Confirm & Pay"
8. **Success**: See booking ID and confirmation!

---

### 3️⃣ Test with Postman (API)

**Get Token:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```
Copy the token from response.

**Create Booking:**
```http
POST http://localhost:5000/api/bookings
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "serviceId": "COPY_SERVICE_ID_FROM_DB",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main Street",
  "city": "Mumbai",
  "pincode": "400001",
  "date": "2024-01-15",
  "timeSlot": "09:00 AM - 11:00 AM",
  "paymentMethod": "cash"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "NEW_BOOKING_ID",
    "status": "pending",
    ...
  }
}
```

---

## 📋 API Endpoints Cheat Sheet

| Action | Endpoint | Method | Access |
|--------|----------|--------|--------|
| Create | `/api/bookings` | POST | Auth |
| Get All | `/api/bookings` | GET | Admin |
| Get One | `/api/bookings/:id` | GET | Auth |
| My Bookings | `/api/bookings/customer/:id` | GET | Auth |
| Update | `/api/bookings/:id` | PUT | Auth |
| Cancel | `/api/bookings/:id/cancel` | PATCH | Auth |
| Confirm | `/api/bookings/:id/confirm` | PATCH | Admin |
| Complete | `/api/bookings/:id/complete` | PATCH | Tech/Admin |
| Assign Tech | `/api/bookings/:id/assign-technician` | PATCH | Admin |

---

## 🎯 React Hooks Usage

### Create Booking
```jsx
import { useCreateBooking } from '@/queries/useBookings';

const { mutate: createBooking, isLoading } = useCreateBooking();

createBooking(bookingData, {
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error),
});
```

### Get My Bookings
```jsx
import { useCustomerBookings } from '@/queries/useBookings';

const { data, isLoading } = useCustomerBookings(userId);
```

### Cancel Booking
```jsx
import { useCancelBooking } from '@/queries/useBookings';

const { mutate: cancelBooking } = useCancelBooking();

cancelBooking(bookingId);
```

---

## 🔧 Troubleshooting

### ❌ "Not authorized, no token"
**Fix**: Make sure you're logged in. Token should be in localStorage.

### ❌ "Service not found"
**Fix**: Run `npm run seed` in Server directory to populate services.

### ❌ "MongoDB connection error"
**Fix**: Start MongoDB: `mongod`

### ❌ CORS errors
**Fix**: Ensure backend is running and CORS is enabled (it is by default).

### ❌ Port 5000 already in use
**Fix**: Change PORT in `Server/.env` or kill the process using port 5000.

---

## 📊 Database Schema

### Booking Object
```javascript
{
  _id: "ObjectId",
  customer: "UserId",
  service: "ServiceId",
  technician: "UserId (optional)",
  firstName: "String",
  lastName: "String",
  email: "String",
  phone: "String",
  address: "String",
  city: "String",
  pincode: "String",
  date: "Date",
  timeSlot: "String",
  notes: "String (optional)",
  price: "Number",
  paymentMethod: "online|cash",
  paymentStatus: "pending|paid|failed",
  status: "pending|confirmed|in-progress|completed|cancelled",
  otpVerified: "Boolean"
}
```

---

## ✅ Testing Checklist

- [ ] Backend server running
- [ ] Frontend client running
- [ ] MongoDB connected
- [ ] Database seeded
- [ ] Can login successfully
- [ ] Can select service
- [ ] Can fill booking form
- [ ] Can verify OTP
- [ ] Can create booking
- [ ] See confirmation screen
- [ ] Can view booking in "My Bookings"
- [ ] Can cancel booking (if pending)

---

## 🎨 Default Credentials

After running `npm run seed`:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | super-admin |

---

## 📚 Full Documentation

- **Implementation Guide**: `BOOKING_MODULE_GUIDE.md`
- **Testing Guide**: `TEST_BOOKING.md`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Server README**: `Server/README.md`

---

## 🎉 That's It!

You're ready to test the booking module. For detailed examples and advanced usage, check the full documentation files.

**Happy Testing! 🚀**
