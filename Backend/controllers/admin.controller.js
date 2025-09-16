import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiErrors.js";
import validator from "validator";
import ApiResponse from "../utils/ApiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../utils/Tokens.js";

export const registerAdmin = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if ([name, email, password].some((field) => field && field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existedAdmin = await Admin.findOne({ email });
  if (existedAdmin) {
    throw new ApiError(400, "Admin already registered with this email");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email");
  }
  if (password.length < 6) {
    throw new ApiError(400, "password must be at least 6 characters long");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }
  const newAdmin = await Admin.create({ name, email, password });

  const accessToken = generateAccessToken({
    _id: newAdmin._id,
    email: newAdmin.email,
    name: newAdmin.name,
  });

  const refreshToken = generateRefreshToken({
    _id: newAdmin._id,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        admin: {
          _id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
        },
        accessToken,
      },
      "Admin register successfully"
    )
  );
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field && field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // console.log("Login request body:", req.body);

  const admin = await Admin.findOne({ email });
  // console.log("Admin found:", admin); // <-- Add this line for debugging

  if (!admin) {
    throw new ApiError(400, "Invalid email or password");
  }
  // console.log("Checking password for admin:", admin.email);
  const isPasswordCorrect = await admin.isPasswordCorrect(password);
  // console.log("Password correct?", isPasswordCorrect);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid password");
  }
  // console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
  // console.log("ACCESS_TOKEN_EXPIRY:", process.env.ACCESS_TOKEN_EXPIRY);
  const accessToken = generateAccessToken({
    _id: admin._id,
    email: admin.email,
    name: admin.name,
  });
  const refreshToken = generateRefreshToken({
    _id: admin._id,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // if (response.data.success) {
  //   setToken(response.data.data.accessToken);
  //   localStorage.setItem("adminToken", response.data.data.accessToken); // <-- add this line
  // }
  // console.log("Returning admin login response:", accessToken);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
        },
        accessToken,
      },
      "Admin logged in successfully"
    )
  );
};
