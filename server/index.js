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
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'https://lead-management-woad.vercel.app',
            'https://lead-management-ayush.vercel.app',
            // Add any other Vercel domains you might have
        ];
        
        // Check if the origin is in the allowed list or is a Vercel app
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('.vercel.app')) {
            return callback(null, true);
        }
        
        // For development, log the origin to help with debugging
        console.log('Blocked CORS request from origin:', origin);
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200 // For legacy browser support
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
