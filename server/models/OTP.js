const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:10000, // OTP expires in 5 minutes
    },
});

async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "OTP Verification", `<p>Your OTP is: <strong>${otp}</strong></p>`);
        console.log("Email sent successfully:", mailResponse);
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
}
otpSchema.pre('save', async function(next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
})

module.exports=mongoose.model('OTP',otpSchema);