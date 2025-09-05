# Render Deployment Configuration

## Backend Deployment (Node.js Service)
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Environment**: Node.js
- **Root Directory**: `/`

## Frontend Deployment (Static Site)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Environment**: Static Site

## Environment Variables Needed:
```
MONGODB_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>
MAIL_HOST=<mail_host>
MAIL_USER=<mail_user>
MAIL_PASS=<mail_password>
```

## Critical Files for User Isolation:
1. `server/middlewares/auth.js` - Handles JWT authentication
2. `server/controllers/leadController.js` - User-specific lead filtering
3. `server/models/Lead.js` - Lead model with user reference
4. `src/components/Navbar.js` - Frontend user state management
5. `src/pages/Dashboard.js` - User-specific dashboard logic

## Troubleshooting Deployment Issues:
1. Check Render logs for build/runtime errors
2. Verify environment variables are set correctly
3. Ensure MongoDB connection string is valid
4. Check that JWT_SECRET is properly configured
5. Verify that the latest code is pushed to GitHub
