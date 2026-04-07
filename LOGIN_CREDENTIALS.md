# 🔐 Login Credentials - Appliance Management System

## Super Admin Access

**Email:** `admin@test.com`  
**Password:** `admin123`

### Features:
- ✅ Dashboard with branch statistics
- ✅ Create, Edit, Delete branches
- ✅ Manage all technicians
- ✅ View all bookings
- ✅ Manage services
- ✅ Generate reports

---

## Other Test Credentials

### Branch Admin
**Email:** `branch@test.com`  
**Password:** `branch123`

### Technician
**Email:** `tech@test.com`  
**Password:** `tech123`

### Customer
**Email:** `customer@test.com`  
**Password:** `customer123`

---

## How to Use

1. **Start the Server:**
   ```bash
   cd Server
   npm start
   ```

2. **Start the Client:**
   ```bash
   cd Client
   npm run dev
   ```

3. **Login:**
   - Navigate to http://localhost:5173
   - Click "Login" button
   - Enter credentials above
   - Super admin will be redirected to `/admin` dashboard

4. **Access Branch Management:**
   - After logging in as super admin
   - Click "Branches" in the sidebar
   - Use "+ Create Branch" button to add new branches

---

## Environment Variables

The credentials are stored in `Server/.env`:

```env
SUPER_ADMIN_EMAIL=admin@test.com
SUPER_ADMIN_PASSWORD=admin123
```

To change credentials:
1. Update `.env` file
2. Re-run seeder: `npm run seed`

---

## Database Seeding

To reset and populate database with test data:

```bash
cd Server
npm run seed
```

This will:
- ✅ Clear existing users and services
- ✅ Create 6 service categories
- ✅ Create 4 user roles (Super Admin, Branch Admin, Technician, Customer)
- ✅ Display all login credentials

---

## Notes

⚠️ **Important:** Change these default credentials in production!
- Update `JWT_SECRET` in `.env`
- Use strong passwords
- Implement proper authentication flow
- Add password reset functionality
