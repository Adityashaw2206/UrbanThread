import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { generateAccessToken, generateRefreshToken } from "../utils/Tokens.js";
import { sendMail } from "../utils/sendMail.js";

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

// const registerUser = async (req,res) => {
//     const {name,email, password, confirmPassword} = req.body;

//     if([name,email,password].some(field => field && field.trim() == "")){
//             throw new ApiError(400,"All fields are required");
//     }
//     const existedUser = await User.findOne({email})
//     if(existedUser){
//         throw new ApiError(400,"User already exists with this email");
//     }
//     if(!validator.isEmail(email)){
//         throw new ApiError(400,"Enter a valid email")
//     }
//     if(password.length < 6){
//         throw new ApiError(400,"Password must be at least 6 characters long");
//     }
//     if(password !== confirmPassword){
//         throw new ApiError(400,"Passwords do not match");
//     }

//     const newUser = await User.create({
//         name,
//         email,
//         password
//     })

//     const accessToken = generateAccessToken({
//         _id: newUser._id,
//         email: newUser.email,
//         name: newUser.name,
//     })

//     const refreshToken = generateRefreshToken({
//         _id: newUser._id,
//     })
//     // const accessToken = newUser.generateAccessToken();
//     // const refreshToken = newUser.generateRefreshToken();

//     res.cookie("refreshToken", refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });
//     //sending mail to user for successful order placement
//         // const user = await User.findById(email);
//         // if (user?.email) {
//         //   await sendMail(
//         //     user.email,
//         //     "Profile created successfully",
//         //     `<h3>Name  ${user.name || "User"},</h3>
//         //     <h3>Email ${user.email || "email"},</h3>
//         //  <p>Your password  <b>${
//         //    password
//         //  }</b> , please keep it safe and do not share it with anyone.</p>`
//         //   );
//         // }

//   // ✅ Send both tokens in response (optional to include refreshToken here)
//     return res.status(201).json(
//         new ApiResponse(201, {
//         user: {
//             _id: newUser._id,
//             name: newUser.name,
//             email: newUser.email,
//         },
//         accessToken,
//         // refreshToken // include this if not using cookies
//         }, "User registered successfully")
//     );

// }

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

export { registerUser, loginUser };
