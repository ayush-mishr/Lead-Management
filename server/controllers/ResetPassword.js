const User = require("../models/User");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");


// resetPassword
exports.resetPassword = async(req, res) => {
    try{
       
        const {email, password, confirmPassword } = req.body;
        
        if(email,!password || !confirmPassword){
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
        const user = await User.findOne({ email: email, resetPasswordExpires: { $gt: Date.now() } });
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