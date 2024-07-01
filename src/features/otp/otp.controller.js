import nodemailer from "nodemailer"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"
import { OTP } from "./otp.schema.js"
import dotenv from "dotenv"
import { User } from "../users/user.model.js"
dotenv.config()

export const sendOtp = asyncHandler(async(req, res)=>{
    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpGenerated = await OTP.create({
        otp: otp,
        userEmail : req.body.email
    })
    if (!otpGenerated) {
        throw new ApiError(401, "Otp not generated")
    }
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL,
            pass : process.env.PASS
        } 
    })
    const mailOptions = {
        from : process.env.EMAIL,
        to : req.body.email,
        subject : "OTP for login",
        text : `Your otp for login is : ${otpGenerated.otp}`
    }
    await transporter.sendMail(mailOptions)
    res.status(200).json(new ApiResponse(200, otpGenerated, "Mail sent Successully"))
})
export const verifyOtp = asyncHandler(async(req, res)=>{
    const verifiedOtp = await OTP.findOne({otp : req.body.otp, userEmail : req.body.email})
    if (!verifiedOtp) {
        throw new ApiError(401, "Otp verification failed")
    }
    res.status(200).json(new ApiResponse(200, verifiedOtp, "Otp verified successfully"))
})

export const resetPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(401, "User not found")
    }
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect")
    }
    user.password = newPassword
    await user.save({validateBeforeSave : false})
    res.status(200).json(new ApiResponse(200, user, "Password reset successfully"))
})