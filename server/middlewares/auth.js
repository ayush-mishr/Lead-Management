const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//authentication
exports.auth = async(req, res, next) => {
    try{
        //extract token 
        const authHeader = req.header('Authorization');
        const cookieToken = req.cookies ? req.cookies.token : null;
        const bodyToken = req.body ? req.body.token : null;
        const token = cookieToken || bodyToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null);
        
        console.log('Auth Debug - Headers:', req.headers.authorization);
        console.log('Auth Debug - Token extracted:', token ? 'Token found' : 'No token');
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found, authorization denied",
            });
        }
        
        //verify token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decode);
            req.user = decode; // Set the user data in request
        }catch(err){
            console.error('Token verification error:', err);
            return res.status(401).json({
                success:false,
                message:"Token is not valid",
            });
        }
        next();

    }catch(err){
        console.error('Error in auth middleware:', err);
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