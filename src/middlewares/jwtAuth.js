import { User } from "../features/users/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

// Middleware to verify JWT
const jwtVerify = asyncHandler(async (req, res, next) => {
    try {
        // Extract access token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        // Verify the access token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized access.");
        }

        // Find the user by the decoded token's ID
        const user = await User.findById(decodedToken._id).select("-password");
        if (!user) {
            throw new ApiError(402, "User error.");
        }

        // Extract refresh token from cookies
        const userRefreshToken = req.cookies?.refreshToken;
        console.log(userRefreshToken)
        console.log(user.refreshToken)
        // Check if the refresh token is valid
        const validRefreshToken = user.refreshToken.some(rt => rt === userRefreshToken);
        if (!validRefreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Error during token verification:", error); // Log the error for debugging
        throw new ApiError(401, "Invalid token", error);
    }
});

export default jwtVerify;
