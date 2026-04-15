# Deployment Guide for Appliance Management System

## Backend Deployment on Render

### 1. Environment Variables to Set on Render

Go to your Render dashboard → Your Service → Environment tab and add these:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-netlify-app.netlify.app
SUPER_ADMIN_EMAIL=admin@test.com
SUPER_ADMIN_PASSWORD=admin123
```

### 2. Render Build Settings

- **Build Command:** `npm install`
- **Start Command:** `node src/server.js`
- **Root Directory:** `Server` (if using monorepo)

### 3. Important Notes

✅ Make sure MongoDB Atlas is accessible from Render (whitelist all IPs: 0.0.0.0/0)  
✅ Use the correct MongoDB connection string with username/password  
✅ JWT_SECRET should be a strong random string  
✅ FRONTEND_URL should match your actual Netlify deployment URL

---

## Frontend Deployment on Netlify

### 1. Environment Variables on Netlify

Go to Netlify dashboard → Site settings → Environment variables:

```
VITE_API_URL=https://your-render-app.onrender.com/api
```

Replace `your-render-app` with your actual Render service name.

### 2. Build Settings on Netlify

- **Base directory:** `Client`
- **Build command:** `npm run build`
- **Publish directory:** `Client/dist`

### 3. netlify.toml Configuration

Already created in `Client/netlify.toml` with:
- ✅ Proper MIME types for JS/CSS files
- ✅ SPA routing redirects
- ✅ Build configuration

---

## Troubleshooting

### Issue: 404 - Page Not Found on Login

**Possible Causes:**
1. ❌ Backend API URL is incorrect in Client/.env
2. ❌ Render service is not running (free tier spins down after 15 minutes)
3. ❌ CORS not configured for your Netlify URL
4. ❌ MongoDB connection failing

**Solutions:**
1. ✅ Check `Client/.env` has correct Render URL:
   ```
   VITE_API_URL=https://your-app.onrender.com/api
   ```

2. ✅ Test your Render backend:
   ```
   https://your-app.onrender.com/api/health
   ```
   Should return: `{"success": true, "message": "Server is running"}`

3. ✅ Check Render logs for errors:
   - Go to Render dashboard
   - Click on your service
   - Check "Logs" tab for any startup errors

4. ✅ Verify MongoDB connection:
   - Check MongoDB Atlas network access
   - Ensure IP whitelist includes 0.0.0.0/0 (all IPs)

5. ✅ Update CORS in server.js:
   - Replace `https://your-netlify-app.netlify.app` with your actual Netlify URL
   - Or use FRONTEND_URL environment variable

### Issue: CORS Error

**Solution:**
- Update the `corsOptions.origin` array in `Server/src/server.js`
- Add your Netlify URL to the list
- Set FRONTEND_URL environment variable on Render

### Issue: Database Connection Error

**Solution:**
- Check MONGODB_URI is correct
- MongoDB Atlas → Network Access → Add IP Address → 0.0.0.0/0
- Verify database user has read/write permissions

---

## Testing Your Deployment

### 1. Test Backend API

```bash
# Test health endpoint
curl https://your-render-app.onrender.com/api/health

# Test login endpoint
curl -X POST https://your-render-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

### 2. Test Frontend

1. Open your Netlify URL in browser
2. Open browser console (F12)
3. Try to login
4. Check Network tab for API calls
5. Look for any errors in console

---

## Common Mistakes

❌ Forgetting to set environment variables on Render/Netlify  
❌ Using localhost URLs in production  
❌ Not updating CORS allowed origins  
❌ MongoDB IP whitelist not configured  
❌ Free tier Render service sleeping (takes 30-50 seconds to wake up)  
❌ Not running database seeder after deployment  

---

## Quick Checklist

- [ ] MongoDB Atlas configured with IP whitelist
- [ ] Render environment variables set
- [ ] Netlify environment variables set
- [ ] CORS updated with Netlify URL
- [ ] Backend health endpoint working
- [ ] Frontend can reach backend API
- [ ] Database seeded with initial data
- [ ] Login functionality tested

---

## Need Help?

Check these logs:
1. **Render Logs:** Dashboard → Your Service → Logs
2. **Netlify Logs:** Dashboard → Your Site → Deploys → Click latest deploy
3. **Browser Console:** F12 → Console tab
4. **Network Tab:** F12 → Network tab → Check API calls
