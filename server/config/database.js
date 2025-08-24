const mongoose = require('mongoose');
require('dotenv').config();

exports.connect =()=>{
    mongoose.connect(process.env.MONGODB_URL, {
       useNewUrlParser: true,
       useUnifiedTopology:true, 
    }).then(()=>{
        console.log('Database connected successfully');
    }).catch((err)=>{
        console.log('Database connection failed', err);
        console.error(err);
        process.exit(1); // Exit the process with failure
    });
}