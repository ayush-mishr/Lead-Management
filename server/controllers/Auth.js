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

    return res.status(200).json({
      success: true,
      user,
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
    const { otp } = req.body;

    // Check if OTP is provided
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    // Find OTP in database
    const existingOtp = await OTP.findOne({ otp });

    // Check if OTP exists
    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // If OTP is found → it's valid
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
    });
  }
};
// Controller to check if email already exists
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Email already registered. Proceed with authentication.",
      });
    } else {
   
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while checking email Or User not Found",
    });
  }
};


exports.sendOtpForLogin = async (req, res) => {
  try {
    const { email } = req.body;

    //  Check if email is provided
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    //  Check if user exists
    const checkUserPresent = await User.findOne({ email });
    if (!checkUserPresent) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    //  Generate a unique OTP
    let otp;
    let isUnique = false;

    while (!isUnique) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      const existingOtp = await OTP.findOne({ otp });
      if (!existingOtp) isUnique = true;
    }

    // Save OTP to DB
    await OTP.create({ email, otp });

    //  Send OTP to user's email
    try {
      await mailSender(email, "Your OTP Code", `Your OTP is ${otp}`);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again later.",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
    });
  }
};
