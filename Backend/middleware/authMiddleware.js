import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiErrors.js";

const authUser = (req, res, next) => {
    // console.log("Token received in header:", req.headers.token);
    const {token} = req.headers;
    if(!token){
        throw new ApiError(401, "Not Authorized login again ");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded._id;
        next();
    } catch (error) {
        console.log(error);
        throw new ApiError(401, error.message);
    } 
}

export default authUser;