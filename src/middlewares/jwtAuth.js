import { User } from "./user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import jwt from "jsonwebtoken"

const jwtVerify = asyncHandler(async(req, res)=>{
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer", "")
        if(!token){
            throw new ApiError("Unauthorized", 401)
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized access.")
        }
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(402, "User error.")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Authentication error", error)
    }
})
export default jwtVerify;