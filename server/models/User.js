const e = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,

    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },

        approved: {
      type: Boolean,
      default: true,
    },
    accountType:{
        type:String,
        enum:['Admin','User'],
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },  
    resetPasswordExpires:{
        type:Date, 
    },
});
module.exports=mongoose.model('User',userSchema);