# Booking Module Implementation Guide

## Overview
This document provides complete documentation for the booking module implementation, including backend API endpoints, frontend integration, and usage examples.

---

## 🎯 Backend Implementation

### 1. Controller (`Server/controllers/bookingController.js`)

The booking controller handles all booking-related operations:

#### **Create Booking**
- **Route**: `POST /api/bookings`
- **Access**: Private (Authenticated users)
- **Body**:
  ```json
  {
    "serviceId": "60d5ecb5c9d4f82b3c8f9a1b",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "alternatePhone": "9876543211",
    "address": "123, Main Street",
    "city": "Mumbai",
    "pincode": "400001",
    "date": "2024-01-15",
    "timeSlot": "09:00 AM - 11:00 AM",
    "notes": "Please call before arrival",
    "paymentMethod": "cash"
  }
  ```

#### **Get All Bookings** (Admin Only)
- **Route**: `GET /api/bookings`
- **Access**: Private/Admin, Branch-Admin
- **Query Params**: `?status=pending&page=1&limit=10`

#### **Get Single Booking**
- **Route**: `GET /api/bookings/:id`
- **Access**: Private (Owner or Admin)

#### **Get Customer Bookings**
- **Route**: `GET /api/bookings/customer/:customerId`
- **Access**: Private (Owner or Admin)
- **Query Params**: `?status=confirmed&page=1&limit=10`

#### **Get Technician Bookings**
- **Route**: `GET /api/bookings/technician/:technicianId`
- **Access**: Private (Technician, Admin, Branch-Admin)
- **Query Params**: `?date=2024-01-15&status=pending`

#### **Update Booking**
- **Route**: `PUT /api/bookings/:id`
- **Access**: Private (Customer before confirmation, or Admin)

#### **Cancel Booking**
- **Route**: `PATCH /api/bookings/:id/cancel`
- **Access**: Private (Customer or Admin)

#### **Confirm Booking**
- **Route**: `PATCH /api/bookings/:id/confirm`
- **Access**: Private/Admin, Branch-Admin

#### **Complete Booking**
- **Route**: `PATCH /api/bookings/:id/complete`
- **Access**: Private/Technician, Admin, Branch-Admin

#### **Assign Technician**
- **Route**: `PATCH /api/bookings/:id/assign-technician`
- **Access**: Private/Admin, Branch-Admin
- **Body**: `{ "technicianId": "60d5ecb5c9d4f82b3c8f9a1c" }`

---

### 2. Routes (`Server/routes/bookingRoutes.js`)

All routes are protected with authentication middleware:

```javascript
POST   /api/bookings                      - Create booking
GET    /api/bookings                      - Get all bookings (Admin)
GET    /api/bookings/:id                  - Get single booking
GET    /api/bookings/customer/:customerId - Get customer bookings
GET    /api/bookings/technician/:techId   - Get technician bookings
PUT    /api/bookings/:id                  - Update booking
PATCH  /api/bookings/:id/cancel           - Cancel booking
PATCH  /api/bookings/:id/confirm          - Confirm booking (Admin)
PATCH  /api/bookings/:id/complete         - Complete booking (Technician/Admin)
PATCH  /api/bookings/:id/assign-technician- Assign technician (Admin)
```

---

### 3. Model (`Server/models/Booking.js`)

Booking schema includes:
- Customer references
- Service references
- Technician assignment
- Contact information
- Address details
- Date and time slot
- Payment information
- Status tracking (pending, confirmed, in-progress, completed, cancelled)

---

## 🎨 Frontend Implementation

### 1. API Layer (`Client/src/api/bookings.api.js`)

Already implemented with axios instance that automatically handles auth tokens.

### 2. React Query Hooks (`Client/src/queries/useBookings.js`)

Available hooks:
- `useBookings(filters)` - Get all bookings (admin)
- `useBooking(bookingId)` - Get single booking
- `useCreateBooking()` - Create new booking
- `useUpdateBooking()` - Update booking
- `useCancelBooking()` - Cancel booking
- `useConfirmBooking()` - Confirm booking
- `useCompleteBooking()` - Complete booking
- `useCustomerBookings(customerId, filters)` - Get customer bookings
- `useTechnicianBookings(technicianId, filters)` - Get technician bookings

### 3. Usage Examples

#### Creating a Booking

```jsx
import { useCreateBooking } from '../../../queries/useBookings';
import { useToast } from '../../../shared/hooks/useToast';

const SummaryScreen = () => {
  const { mutate: createBooking, isLoading } = useCreateBooking();
  const { success, error } = useToast();
  
  const handleConfirm = () => {
    const bookingData = {
      serviceId: selectedService.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123, Main Street',
      city: 'Mumbai',
      pincode: '400001',
      date: '2024-01-15',
      timeSlot: '09:00 AM - 11:00 AM',
      paymentMethod: 'cash',
    };
    
    createBooking(bookingData, {
      onSuccess: (data) => {
        success('Booking created!', data.data._id);
      },
      onError: (err) => {
        error(err?.response?.data?.message || 'Failed to create booking');
      },
    });
  };
  
  return <button onClick={handleConfirm}>Confirm Booking</button>;
};
```

#### Getting Customer Bookings

```jsx
import { useCustomerBookings } from '../../../queries/useBookings';
import { useSelector } from 'react-redux';

const MyBookingsScreen = () => {
  const auth = useSelector((state) => state.auth);
  const { data, isLoading, error } = useCustomerBookings(auth.user.id, {
    status: 'confirmed',
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading bookings</div>;
  
  return (
    <div>
      {data.data.map((booking) => (
        <div key={booking._id}>
          <h3>{booking.service.name}</h3>
          <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
          <p>Status: {booking.status}</p>
        </div>
      ))}
    </div>
  );
};
```

#### Cancelling a Booking

```jsx
import { useCancelBooking } from '../../../queries/useBookings';

const BookingCard = ({ bookingId }) => {
  const { mutate: cancelBooking } = useCancelBooking();
  
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId, {
        onSuccess: () => {
          console.log('Booking cancelled successfully');
        },
      });
    }
  };
  
  return <button onClick={handleCancel}>Cancel Booking</button>;
};
```

---

## 🔧 Testing the Implementation

### 1. Start the Backend Server

```bash
cd Server
npm run dev
```

Server should start on `http://localhost:5000`

### 2. Start the Frontend Client

```bash
cd Client
npm run dev
```

Client should start on `http://localhost:5173` (or your configured port)

### 3. Test Booking Creation Flow

1. **Login/Register** as a customer
2. **Select a service** from the home page
3. **Fill in booking details**:
   - Customer information
   - Address details
   - Date and time slot
   - Payment method
4. **Verify OTP** (simulated)
5. **Confirm booking**

### 4. Test with Postman/Thunder Client

#### Example: Create Booking

```http
POST http://localhost:5000/api/bookings
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "serviceId": "SERVICE_ID_HERE",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123, Main Street",
  "city": "Mumbai",
  "pincode": "400001",
  "date": "2024-01-15T00:00:00.000Z",
  "timeSlot": "09:00 AM - 11:00 AM",
  "paymentMethod": "cash"
}
```

#### Example: Get Customer Bookings

```http
GET http://localhost:5000/api/bookings/customer/USER_ID_HERE
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📊 Database Schema

### Booking Document Structure

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

## 🔐 Security Features

1. **Authentication Required**: All booking endpoints require valid JWT token
2. **Role-Based Access Control**:
   - Customers can only view/manage their own bookings
   - Technicians can view assigned bookings
   - Admins/Branch-Admins have full access
3. **Input Validation**: Required fields validated on backend
4. **Protected Updates**: Cannot update completed/cancelled bookings

---

## 🚀 Features Implemented

### Backend ✅
- [x] Create booking with service reference
- [x] Get all bookings (with pagination and filters)
- [x] Get single booking by ID
- [x] Get customer-specific bookings
- [x] Get technician-specific bookings
- [x] Update booking details
- [x] Cancel booking
- [x] Confirm booking (Admin)
- [x] Complete booking (Technician/Admin)
- [x] Assign technician to booking (Admin)
- [x] Role-based authorization
- [x] Input validation
- [x] Error handling

### Frontend ✅
- [x] API integration layer
- [x] React Query hooks for all operations
- [x] Automatic token management
- [x] Booking creation flow
- [x] Error handling with toast notifications
- [x] Loading states
- [x] Success/error feedback

---

## 📝 Notes

1. **OTP Verification**: Currently simulated in frontend. Implement actual SMS service (Twilio, MSG91, etc.) for production.
2. **Payment Integration**: Cash payment is default. Integrate payment gateway (Razorpay, Stripe) for online payments.
3. **Notifications**: Add email/SMS notifications for booking confirmations, reminders, and status updates.
4. **Real-time Updates**: Consider implementing WebSocket/socket.io for real-time booking status updates.

---

## 🐛 Troubleshooting

### Common Issues

1. **"Not authorized, no token" error**
   - Ensure user is logged in
   - Check if token is stored in localStorage
   - Verify axios interceptor is adding Authorization header

2. **"Service not found" error**
   - Verify serviceId is valid MongoDB ObjectId
   - Check if service exists in database

3. **CORS errors**
   - Ensure backend has CORS enabled (already configured)
   - Check if frontend is calling correct API URL

4. **Database connection errors**
   - Verify MongoDB is running
   - Check MONGODB_URI in .env file

---

## 📞 Support

For issues or questions, refer to:
- Main README.md
- ARCHITECTURE.md
- SETUP.md
