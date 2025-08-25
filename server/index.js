const express = require("express");
const app = express();

const userRoutes = require("./routes/user");
const leadRoutes=require("./routes/leads")
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConfig} = require("./config/cloudinaryConfig");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;
//database connection
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    
 
}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));
//cloudinary configuration
cloudinaryConfig();
//routes
app.use("/api/v1/auth", userRoutes);

app.use("/api/v1/leads", leadRoutes);

app.get("/", (req, res) => {
   return res.json({
    success: true,
    message: "Server is running",
   });
});
//server listening
app.listen(4000, () => {
    console.log(`Server is running on port ${4000}`);
});
