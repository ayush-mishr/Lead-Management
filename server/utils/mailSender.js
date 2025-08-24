const nodemailer = require('nodemailer');
require('dotenv').config();
const mailSender = async(email, title, body)=>{
try {
        let transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        }

        });
                let info = await transporter.sendMail({
            from:"Ayush Mishra ",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
            
});
console.log("Message sent: %s", info.messageId);
return info;
}
catch(err){
    console.error("Error sending email:", err);
    throw new Error("Email sending failed");
}
}
module.exports=mailSender;