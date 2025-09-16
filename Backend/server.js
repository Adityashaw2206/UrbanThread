import dotenv from 'dotenv';
dotenv.config()
// console.log("Loaded STRIPE key:", process.env.STRIPE_SECRET_KEY);

// console.log("ENV:", process.env);


import mongoose from 'mongoose';
import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import nodemailer from 'nodemailer';
import WebHookRoutes from './routes/WebHookRoutes.js';
const app = express()


app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173", // Admin frontend
  "http://localhost:5174", // User frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



app.post(
  "/api/order/webhook/stripe",
  express.raw({ type: "application/json" }),
  orderRouter
);


app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER, // Company's email
      subject: `Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});


app.get('/',(req,res) => {
    res.send("API working fine");
})
app.use(express.json({limit: '1mb' }));
app.use(urlencoded({limit: '1mb', extended: true}));
app.use(express.static("public"));
app.use(cookieParser());


//api end points

app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)

app.use('/api/orders',orderRouter);
app.use('/api/reviews', reviewRouter);
// ⚠️ Stripe requires raw body for webhooks
app.use("/api/stripe", WebHookRoutes);
app.use(errorMiddleware);

export default app;