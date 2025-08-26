const User = require("../models/User");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try{
        //get email from req body 
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found with this email",
            });
        }
        //generate token
        const token = crypto.randomUUID();
        const updateDetails =await User.findOneAndUpdate({email:email},
            {token:token,
                resetPasswordExpires:Date.now() + 5*60*1000 //1 hour
            },{new:true}); 

   //create reset url
   const url = `http://localhost:3000/update-password/${token}`;
   await mailSender(email, "Reset Password Link", `Click on the link to reset your password. This link is valid for 5 minutes. ${url}`);
   return res.status(200).json({
    success:true,   
    message:"Reset password link sent to your email",
    });
    }catch(err){
        console.error('Error in resetPasswordToken:', err);
        res.status(500).json({ message: 'some thing went wrong' });
    }
}
// resetPassword
exports.resetPassword = async(req, res) => {
    try{
       
        const { token, password, confirmPassword } = req.body;
        
        if(!token || !password || !confirmPassword){
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
        const user = await User.findOne({ token: token, resetPasswordExpires: { $gt: Date.now() } });
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired token",
            });
        }
        //hash password
      const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});
        return res.status(200).json({
            success:true,
            message:"Password reset successful",
        });
    }catch(err){
        console.error('Error in resetPassword:', err);
        res.status(500).json({ message: 'some thing went wrong' });
    }
}