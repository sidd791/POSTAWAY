import { Router } from "express";
import { resetPassword, sendOtp, verifyOtp } from "./otp.controller.js";
import jwtVerify from "../../middlewares/jwtAuth.js"
export const otpRouter = Router()

otpRouter.route('/send').post(sendOtp)
otpRouter.route('/verify').post(verifyOtp)
otpRouter.route('/reset-password').post(jwtVerify, resetPassword)