import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { generateAccessToken, generateRefreshToken } from "../utils/Tokens.js";
import { sendMail } from "../utils/sendMail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";





const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if ([name, email, password].some((field) => field && field.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }
  // ✅ Add this line to debug
  console.log("Received signup request for email:", email);
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Enter a valid email");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const accessToken = generateAccessToken({
    _id: newUser._id,
    email: newUser.email,
    name: newUser.name,
  });

  const refreshToken = generateRefreshToken({
    _id: newUser._id,
  });


  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // ✅ Send mail after successful registration
  await sendMail(
    newUser.email,
    "Profile created successfully",
    `<h3>Name: ${newUser.name || "User"}</h3>
     <h3>Email: ${newUser.email}</h3>
     <p>Your password is <b>${password}</b>. Please keep it safe and do not share it with anyone.</p>`
  );

  // ✅ Send both tokens in response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        accessToken,
        // refreshToken // include this if not using cookies
      },
      "User registered successfully"
    )
  );
});


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field && field.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({
    email,
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken({
    _id: user._id,
    email: user.email,
    name: user.name,
  });

  const refreshToken = generateRefreshToken({
    _id: user._id,
  });
  // const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  // if(!isPasswordValid){
  //     throw new ApiError(400,"Invalid password");
  // }

  const loggedInUser = await User.findById(user.id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
};



// Forgot Password
const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `
    <h2>Password Reset Request</h2>
    <p>Click below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link expires in 10 minutes.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: "Email could not be sent" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};


export { registerUser, loginUser,  resetPassword, forgotPassword };
