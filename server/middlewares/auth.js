const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//authentication
exports.auth = async(req, res, next) => {
    try{
        // Debug logging
        console.log("🔐 AUTH MIDDLEWARE DEBUG:");
        console.log("  All headers:", req.headers);
        console.log("  Authorization header:", req.headers.authorization);
        console.log("  Cookies:", req.cookies);
        
        //extract token 
        let token = req.cookies.token || req.body.token;
        
        // Handle Authorization header more safely
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.replace('Bearer ', '');
        }
        
        console.log("  Extracted token:", token ? "✅ Found" : "❌ Not found");
        console.log("  Token length:", token ? token.length : 0);
        
        if(!token){
            console.log("  ❌ No token found in cookies, body, or Authorization header");
            return res.status(401).json({
                success:false,
                message:"Token not found, authorization denied",
            });
        }
        //verify token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log('  ✅ Decoded token:', decode);
            
            // Set the user information from the decoded token
            req.user = decode;
            console.log('  ✅ req.user set to:', req.user);
            
        }catch(err){
            console.log("  ❌ Token verification failed:", err.message);
            return res.status(401).json({
                success:false,
                message:"Token is not valid",
            });
        }
        next();

    }catch(err){
        console.error('❌ Error in auth middleware:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
//isUser
exports.isUser = async(req, res, next) => {
    try{
     if(req.user.accountType !== 'User'){
        return res.status(401).json({
            success:false,
            message:"This is a protected route for users only",
        });
     }
        next();

    }
    catch(err){
        console.error('Error in User middleware:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}//isAdmin
exports.isAdmin = async(req, res, next) => {
    try{
     if(req.user.accountType !== 'Admin'){
        return res.status(401).json({
            success:false,
            message:"This is a protected route for admins only",
        });
     }
        next();
    }catch(err){
        console.error('Error in isAdmin middleware:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}