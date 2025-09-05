const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
require('dotenv').config();

 

exports.sendOTP = async (req, res) => {
  
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

exports.signUp = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body
    // Check if All Details are there or not
    const data ={
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    }
    console.log("Data...............",data)
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
   let approved = ""
    approved === "ADMIN" ? (approved = false) : (approved = true)

    // Create the Additional Profile For User
    
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      image: "Ld.jpg", 
    });

    // Create JWT token for the newly registered user
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    user.token = token;
    user.password = undefined;

    // Cookie setting
    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie('token', token, options).status(200).json({
      success: true,
      user,
      token,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}
exports.login = async(req, res) => {
    try{
        //data fetch from req body
        const { email, password } = req.body;
        //validation
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            });
        }
        //check user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User does not exist",
            });
        }
        //compare password
        if(await bcrypt.compare(password, user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            };
           const token =jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1d'});
           user.token=token;
              user.password=undefined;
              //cookie setting
              const options={
                expires:new Date(Date.now()+24*60*60*1000),
                httpOnly:true,
              };    
                res.cookie('token',token,options).status(200).json({
                    success:true,
                    message:"Login Successful",
                    user,
                    token,
                });
              
        }
     else{
            return res.status(401).json({
                success:false,
                message:"Incorrect Password",
            });
        }
    }catch(err){
        console.error('Error in login:', err);
         return res.status(500).json({ message: 'Internal server error' });

    }
}

exports.verifyOtp = async (req, res) => {
  try {
    const {email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (response.length === 0 || response[0].otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


//sendOtpForLogin

exports.sendOtpForLogin = async (req, res) => {
  
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (!checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Not Registered`,
      })
    }
    
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

// resetPassword
exports.resetPassword = async(req, res) => {
    try{
       
        const {email, password, confirmPassword } = req.body;
        
        if(!email||!password || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password do not match",
            });
        }
        const user = await User.findOne({ email: email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or not a registered email",
            });
        }
        //hash password
      const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await User.findOneAndUpdate({email:email},{password:hashedPassword},{new:true});
        return res.status(200).json({
            success:true,
            message:"Password reset successful",
        });
    }catch(err){
        console.error('Error in resetPassword:', err);
        res.status(500).json({ message: 'some thing went wrong' });
    }
}