import dotenv from "dotenv";
dotenv.config()

import connectDB from "./db/index.js";
import app from "./server.js";
import connectCloudinary  from "./utils/cloudinary.js";  
connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("MongoDB connection failed !!",err);
})

connectCloudinary()
