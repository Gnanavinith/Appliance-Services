# Booking Module Testing Guide

## Prerequisites

1. **MongoDB Running**: Ensure MongoDB is running on `mongodb://localhost:27017/Appliances`
2. **Backend Server**: Run `npm run dev` in Server directory
3. **Frontend Client**: Run `npm run dev` in Client directory
4. **Seeded Database**: Run `npm run seed` in Server directory to populate initial data

---

## Testing with Postman/Thunder Client

### Step 1: Register/Login to Get Token

#### Register New User
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response**: Save the token from response

#### Or Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response**: Save the token from response

---

### Step 2: Get Available Services

```http
GET http://localhost:5000/api/services
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response**: Copy a service `_id` for testing

---

### Step 3: Create a Booking

```http
POST http://localhost:5000/api/bookings
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "serviceId": "PASTE_SERVICE_ID_HERE",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "alternatePhone": "9876543211",
  "address": "123, Main Street, Andheri",
  "city": "Mumbai",
  "pincode": "400053",
  "date": "2024-04-15T10:00:00.000Z",
  "timeSlot": "09:00 AM - 11:00 AM",
  "notes": "Please call 10 minutes before arrival",
  "paymentMethod": "cash"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "BOOKING_ID",
    "customer": {...},
    "service": {...},
    "status": "pending",
    ...
  }
}
```

---

### Step 4: View Your Bookings

```http
GET http://localhost:5000/api/bookings/customer/YOUR_USER_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### Step 5: View Single Booking

```http
GET http://localhost:5000/api/bookings/BOOKING_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### Step 6: Update Booking (Before Confirmation)

```http
PUT http://localhost:5000/api/bookings/BOOKING_ID
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "notes": "Updated: Please ring doorbell twice",
  "alternatePhone": "9988776655"
}
```

---

### Step 7: Admin Actions (Requires Admin Token)

#### Confirm Booking
```http
PATCH http://localhost:5000/api/bookings/BOOKING_ID/confirm
Authorization: Bearer ADMIN_TOKEN_HERE
```

#### Assign Technician
```http
PATCH http://localhost:5000/api/bookings/BOOKING_ID/assign-technician
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN_HERE

{
  "technicianId": "TECHNICIAN_ID_HERE"
}
```

#### Complete Booking
```http
PATCH http://localhost:5000/api/bookings/BOOKING_ID/complete
Authorization: Bearer ADMIN_TOKEN_OR_TECHNICIAN_TOKEN
```

---

### Step 8: Cancel Booking

```http
PATCH http://localhost:5000/api/bookings/BOOKING_ID/cancel
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Testing via Frontend UI

### Complete Booking Flow

1. **Start Both Servers**
   ```bash
   # Terminal 1 - Backend
   cd Server
   npm run dev
   
   # Terminal 2 - Frontend
   cd Client
   npm run dev
   ```

2. **Open Browser**: Navigate to frontend URL (usually `http://localhost:5173`)

3. **Register/Login**:
   - Click on login/signup
   - Register new user or use seeded admin account
   - Email: `admin@example.com`, Password: `password123`

4. **Select Service**:
   - Browse available services
   - Click "Book Now" on desired service

5. **Fill Booking Form**:
   - **Step 1**: Enter customer details (name, email, phone)
   - **Step 2**: Enter address details (address, city, pincode)
   - **Step 3**: Select date and time slot
   - **Step 4**: Choose payment method (Cash/Online)

6. **Review & Confirm**:
   - Review all details on summary page
   - Click "Send OTP" (simulated)
   - Enter any 4-digit OTP (e.g., 1234)
   - Click "Confirm & Pay"

7. **Success**:
   - Should redirect to confirmation page
   - Booking ID displayed
   - Download invoice option available

8. **View My Bookings**:
   - Navigate to "My Bookings" section
   - Should see the created booking
   - Can view details, cancel if needed

---

## Testing Different User Roles

### Customer Role
- ✅ Create bookings
- ✅ View own bookings
- ✅ Cancel own bookings (before completion)
- ❌ Cannot view other customers' bookings
- ❌ Cannot confirm bookings
- ❌ Cannot assign technicians

### Technician Role
- ✅ View assigned bookings
- ✅ Update booking status to "in-progress"
- ✅ Complete bookings
- ❌ Cannot cancel bookings
- ❌ Cannot assign other technicians

### Branch Admin Role
- ✅ View all bookings in their branch
- ✅ Confirm bookings
- ✅ Assign technicians
- ✅ Complete bookings
- ✅ Cancel bookings

### Super Admin Role
- ✅ View all bookings across all branches
- ✅ Full CRUD operations on all bookings
- ✅ Access analytics and reports

---

## Expected API Responses

### Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description here"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number must be 10 digits"
    }
  ]
}
```

---

## Common Test Scenarios

### Scenario 1: Happy Path - Complete Booking Flow
1. User registers ✓
2. User logs in ✓
3. User selects service ✓
4. User fills all details correctly ✓
5. User verifies OTP ✓
6. Booking created successfully ✓
7. User receives confirmation ✓

### Scenario 2: Validation Tests
- ❌ Create booking without service ID → Should fail
- ❌ Create booking without phone → Should fail
- ❌ Create booking with invalid email → Should fail
- ❌ Create booking with invalid pincode → Should fail
- ❌ Create booking without date → Should fail

### Scenario 3: Authorization Tests
- Customer trying to access admin routes → 403 Forbidden
- Customer trying to view other's bookings → 403 Forbidden
- Unauthenticated user trying to create booking → 401 Unauthorized
- Technician confirming booking → 403 Forbidden (only admin)

### Scenario 4: Business Logic Tests
- Cancelling completed booking → Should fail
- Updating confirmed booking by customer → Should fail
- Assigning technician to cancelled booking → Should succeed but booking remains cancelled

---

## Debugging Tips

1. **Check Server Logs**: Look for error messages in terminal running backend
2. **Check Browser Console**: Look for frontend errors
3. **Verify Token**: Ensure token is valid and not expired
4. **Check Network Tab**: Inspect request/response in browser DevTools
5. **Database Check**: Use MongoDB Compass to verify data

---

## Performance Testing

### Load Test Parameters
- Concurrent users: 100
- Requests per second: 50
- Average response time: < 200ms
- Error rate: < 1%

### Tools
- Apache Bench (ab)
- Artillery.io
- k6

Example with Apache Bench:
```bash
ab -n 1000 -c 10 \
   -H "Authorization: Bearer YOUR_TOKEN" \
   -H "Content-Type: application/json" \
   -p booking.json \
   http://localhost:5000/api/bookings
```

---

## Monitoring & Logging

### Server Logs
- Morgan HTTP logging enabled
- Console.error for errors
- Add custom logging as needed

### Client Logs
- React Query DevTools for API calls
- Redux DevTools for state management
- Browser console for errors

---

## Next Steps After Testing

1. ✅ All tests passing
2. ✅ No validation errors
3. ✅ Proper authorization working
4. ✅ Frontend-backend integration complete
5. ✅ Ready for production deployment

---

## Production Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Enable HTTPS
- [ ] Set up MongoDB Atlas or production database
- [ ] Configure CORS for production domain
- [ ] Set up proper logging (Winston, Bunyan)
- [ ] Implement rate limiting
- [ ] Add monitoring (New Relic, DataDog)
- [ ] Set up CI/CD pipeline
- [ ] Configure backup strategy
- [ ] Implement actual SMS service for OTP
- [ ] Integrate payment gateway
