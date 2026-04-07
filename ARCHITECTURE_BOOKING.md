# 🏗️ Booking Module Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["React Frontend (Client)"]
        UI[UI Components]
        HOOKS[React Query Hooks]
        API[API Layer - Axios]
        STORE[Redux Store]
        
        UI --> HOOKS
        HOOKS --> API
        API --> STORE
    end
    
    subgraph Backend["Express Backend (Server)"]
        ROUTES[Booking Routes]
        CTRL[Booking Controller]
        AUTH[Auth Middleware]
        MODEL[Booking Model]
        
        ROUTES --> CTRL
        CTRL --> AUTH
        CTRL --> MODEL
    end
    
    subgraph Database["MongoDB Database"]
        BOOKINGS[Bookings Collection]
        USERS[Users Collection]
        SERVICES[Services Collection]
    end
    
    API -->|HTTP Requests| ROUTES
    MODEL --> BOOKINGS
    MODEL --> USERS
    MODEL --> SERVICES
```

---

## Data Flow Sequence

### Creating a New Booking

```mermaid
graph LR
    A[User Fills Form] --> B[BookingScreen]
    B --> C[Store in Redux]
    C --> D[SummaryScreen]
    D --> E[OTP Verification]
    E --> F[useCreateBooking Hook]
    F --> G[Axios API Call]
    G --> H[JWT Token Added]
    H --> I[POST /api/bookings]
    I --> J[Auth Middleware]
    J --> K[Booking Controller]
    K --> L[Validate Data]
    L --> M[Fetch Service Details]
    M --> N[Create Booking Doc]
    N --> O[MongoDB]
    O --> P[Return Booking]
    P --> Q[Frontend Success]
    Q --> R[Navigate to Confirmation]
```

---

## Component Architecture

### Frontend Component Tree

```
AppRouter
├── CustomerRoutes
│   ├── HomeScreen
│   │   └── ServiceCard → Navigate to BookingScreen
│   ├── BookingScreen (Multi-step Form)
│   │   ├── Step 1: Customer Details
│   │   ├── Step 2: Address
│   │   ├── Step 3: Date & Time
│   │   └── Step 4: Payment
│   ├── SummaryScreen
│   │   ├── OTPInput
│   │   └── useCreateBooking Hook
│   └── ConfirmationScreen
└── Other Routes...
```

---

## Backend Route Structure

```
/api/bookings
├── POST   /                          createBooking
├── GET    /                          getBookings (Admin)
├── GET    /:id                      getBooking
├── GET    /customer/:customerId     getCustomerBookings
├── GET    /technician/:technicianId getTechnicianBookings
├── PUT    /:id                      updateBooking
├── PATCH  /:id/cancel               cancelBooking
├── PATCH  /:id/confirm              confirmBooking (Admin)
├── PATCH  /:id/complete             completeBooking (Tech/Admin)
└── PATCH  /:id/assign-technician    assignTechnician (Admin)
```

---

## Authentication Flow

```mermaid
graph TD
    A[User Login] --> B[AuthController]
    B --> C[Validate Credentials]
    C --> D[Generate JWT Token]
    D --> E[Return Token + User Data]
    E --> F[Store in Redux + localStorage]
    F --> G[Subsequent Requests]
    G --> H[Axios Interceptor]
    H --> I[Add Bearer Token Header]
    I --> J[Protected Route]
    J --> K[Auth Middleware - protect]
    K --> L[Verify JWT Token]
    L --> M[Get User from DB]
    M --> N[Attach req.user]
    N --> O[Authorize if needed]
    O --> P[Allow Request]
```

---

## Role-Based Access Control Matrix

| Operation | Customer | Technician | Branch Admin | Super Admin |
|-----------|----------|------------|--------------|-------------|
| Create Booking | ✅ Own | ❌ | ❌ | ❌ |
| View Own Bookings | ✅ | ✅ | ✅ | ✅ |
| View All Bookings | ❌ | ❌ | ✅ Branch | ✅ All |
| Update Booking | ✅ Own (pending) | ❌ | ✅ | ✅ |
| Cancel Booking | ✅ Own | ❌ | ✅ | ✅ |
| Confirm Booking | ❌ | ❌ | ✅ | ✅ |
| Complete Booking | ❌ | ✅ Assigned | ✅ | ✅ |
| Assign Technician | ❌ | ❌ | ✅ | ✅ |

---

## Booking Status Workflow

```mermaid
graph LR
    A[pending] --> B{Action}
    B -->|Admin Confirms| C[confirmed]
    B -->|Customer Cancels| D[cancelled]
    C --> E{Action}
    E -->|Technician Starts| F[in-progress]
    E -->|Customer Cancels| D
    F --> G{Action}
    G -->|Job Done| H[completed]
    G -->|Issue| D
```

---

## Database Relationships

```mermaid
graph TD
    BOOKING[Booking]
    USER[User]
    SERVICE[Service]
    
    BOOKING -->|customer (ref)| USER
    BOOKING -->|service (ref)| SERVICE
    BOOKING -->|technician (ref)| USER
    
    USER -->|has many| BOOKING
    SERVICE -->|has many| BOOKING
```

---

## State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: { id, name, email, phone, role },
    token: "jwt_token",
    isAuthenticated: true/false
  },
  booking: {
    currentBooking: null,
    bookings: [],
    draftBooking: {
      serviceId: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
      date: null,
      timeSlot: '',
      notes: '',
      paymentMethod: 'cash'
    },
    otpSent: false,
    otpVerified: false
  }
}
```

---

## React Query Cache Structure

```javascript
Query Cache:
{
  ['bookings', { status: 'pending', page: 1 }]: [...],
  ['booking', 'BOOKING_ID']: {...},
  ['customerBookings', 'USER_ID', { status: 'confirmed' }]: [...],
  ['technicianBookings', 'TECH_ID', { date: '2024-01-15' }]: [...]
}
```

---

## Error Handling Chain

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type}
    B -->|Validation| C[400 Bad Request]
    B -->|Auth Failed| D[401 Unauthorized]
    B -->|Not Authorized| E[403 Forbidden]
    B -->|Not Found| F[404 Not Found]
    B -->|Server Error| G[500 Internal Server Error]
    
    C --> H[Error Response Format]
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I[Frontend Receives Error]
    I --> J[Toast Notification]
    J --> K[User Sees Error Message]
```

---

## API Request/Response Cycle

```mermaid
sequenceDiagram
    participant User
    participant UI as React Component
    participant Hook as React Query Hook
    participant API as Axios Instance
    participant Server as Express Server
    participant DB as MongoDB
    
    User->>UI: Submit Booking Form
    UI->>Hook: mutate(bookingData)
    Hook->>API: POST /api/bookings
    API->>API: Add Auth Token
    API->>Server: HTTP Request
    Server->>Server: Auth Middleware
    Server->>Server: Validate Data
    Server->>DB: Insert Booking
    DB->>Server: Booking Document
    Server->>Server: Populate References
    Server->>API: JSON Response
    API->>Hook: Success Callback
    Hook->>UI: Update UI
    UI->>User: Show Confirmation
```

---

## Security Layers

```mermaid
graph TB
    A[Request] --> B[CORS Check]
    B --> C[Rate Limiting]
    C --> D[Express Validator]
    D --> E[Auth Middleware]
    E --> F[JWT Verification]
    F --> G[User Lookup]
    G --> H[Role Authorization]
    H --> I[Business Logic]
    I --> J[Database Operation]
    J --> K[Response Sanitization]
    K --> L[Response]
```

---

## File Organization

```
Appliance Management/
├── Client/
│   └── src/
│       ├── api/
│       │   └── bookings.api.js
│       ├── queries/
│       │   └── useBookings.js
│       └── apps/
│           └── customer/
│               └── screens/
│                   ├── BookingScreen.jsx
│                   ├── SummaryScreen.jsx
│                   └── ConfirmationScreen.jsx
│
└── Server/
    ├── controllers/
    │   └── bookingController.js
    ├── routes/
    │   └── bookingRoutes.js
    ├── models/
    │   └── Booking.js
    └── middleware/
        └── auth.js
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph Client["Frontend Hosting (Vercel/Netlify)"]
        REACT[React App]
        CDN[Static Assets CDN]
    end
    
    subgraph Server["Backend Hosting (Heroku/Railway/AWS)"]
        EXPRESS[Express Server]
        LB[Load Balancer]
    end
    
    subgraph DB["Database (MongoDB Atlas)"]
        MONGO[MongoDB Cluster]
        BACKUP[Automatic Backups]
    end
    
    REACT --> CDN
    CDN --> EXPRESS
    EXPRESS --> LB
    LB --> MONGO
    MONGO --> BACKUP
```

---

## Monitoring Points

- **API Response Time**: Target < 200ms
- **Database Query Time**: Target < 100ms
- **Error Rate**: Target < 1%
- **Concurrent Users**: Support 100+ users
- **Booking Creation Success Rate**: Target > 99%

---

**Architecture Documentation Complete! 🎯**
