# 🚀 Deployment Guide for Lead Management System

## Current Issue: Authentication not working on deployed site

### ❌ Problem
After deploying to Render/Vercel, sign in, sign up, and OTP functionality are broken because the frontend is trying to connect to `localhost:4000` instead of your deployed backend.

### ✅ Solution

## Step 1: Backend (Render) Deployment

Your backend is already deployed at: `https://lead-management-2-wnen.onrender.com`

**Environment Variables for Render (Backend):**
```
MONGODB_URL=mongodb+srv://Ayush:eEK6Ce0TFTjyCCgB@managers.p6wtjak.mongodb.net/
MAIL_HOST=smtp.gmail.com
MAIL_USER=ayushmishramay22@gmail.com
MAIL_PASS=uasuvfbvkkvmjons
JWT_SECRET=Ayush
FOLDER_NAME=Ayush_Stuff
CLOUD_NAME=dciv3db5z
API_KEY=861912878782726
API_SECRET=uiRMitbHNknS3wSWJSEwVVCThtg
PORT=4000
NODE_ENV=production
```

## Step 2: Frontend (Vercel) Deployment

### Environment Variables for Vercel (Frontend):
```
REACT_APP_BASE_URL=https://lead-management-2-wnen.onrender.com/api/v1
REACT_APP_ENV=production
REACT_APP_OPENROUTER_API_KEY=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
```

### How to set environment variables in Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above

### How to set environment variables in Render:
1. Go to your Render dashboard
2. Select your web service
3. Go to Environment
4. Add each variable above

## Step 3: Update Build Commands

### For Vercel (Frontend):
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### For Render (Backend):
- **Build Command:** `npm install`
- **Start Command:** `npm start`

## Step 4: CORS Configuration (Important!)

Make sure your backend allows requests from your Vercel domain. Update your server's CORS settings:

```javascript
// In your server/index.js or main server file
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000', // For local development
    'https://your-vercel-app.vercel.app', // Your Vercel domain
    'https://lead-management-ayush.vercel.app' // Example
  ],
  credentials: true
}));
```

## Step 5: Test Deployment

After setting environment variables:

1. **Redeploy both services** (this is crucial!)
2. Test authentication flow:
   - Sign up with new email
   - Check OTP email delivery
   - Try login
   - Test dashboard functionality

## 🔧 Quick Fixes

### If you're still having issues:

1. **Check Network Tab in Browser:**
   - Open Developer Tools (F12)
   - Go to Network tab
   - Try to sign up/login
   - Check if API calls are going to the correct URL

2. **Check Console for Errors:**
   - Look for CORS errors
   - Look for network connection errors

3. **Verify Environment Variables:**
   ```bash
   # In your deployed frontend, check if the URL is correct
   console.log('API Base URL:', process.env.REACT_APP_BASE_URL);
   ```

## 📋 Deployment Checklist

- [ ] Backend deployed to Render with correct environment variables
- [ ] Frontend deployed to Vercel with correct environment variables
- [ ] CORS configured to allow frontend domain
- [ ] Both services redeployed after environment variable changes
- [ ] Database connection working (check Render logs)
- [ ] Email service working (check if OTP emails are sent)

## 🆘 Still Having Issues?

1. Check Render logs for backend errors
2. Check Vercel function logs for frontend errors
3. Verify your MongoDB connection string
4. Test email service separately
5. Check if your Gmail app password is still valid

## 🔗 URLs to Update

Make sure these match your actual deployed URLs:
- **Backend URL:** `https://lead-management-2-wnen.onrender.com`
- **Frontend URL:** `https://your-app-name.vercel.app`

After following these steps, your authentication should work properly on the deployed site!
