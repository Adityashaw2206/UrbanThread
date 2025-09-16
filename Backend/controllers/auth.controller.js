import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(400,"User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false});
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(400,"something went wrong while generating tokens");
    }
}

const registerUser = AsyncHandler(async(req,res) =>{
    const {fullname,phone,email,password,role} = req.body();
    if(fullname === ""){
        throw new ApiError(400,"Fullname is required");
    }
    if([fullname,email,password,phone].some(field => field && FileSystem.trim() == "")){
        throw new ApiError(400,"All fields are required");
    }
    const existedUser = await User.findOne({
        $or:[{fullname},{email}],
    })
    if(existedUser){
        throw new ApiError(400,"User already exists with this email or phone number");
    }

    const user = await User.create({
        fullname,
        phone,
        email,
        role,
        password
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while creating user");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200,createdUser,"User created successfully")
        )
});

const loginUser = AsyncHandler(async(req,res) => {
    
})