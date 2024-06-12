import express, { Router } from "express"
import {registerUser, signIn, signOut} from "./user.controller.js"
import jwtVerify from "../../middlewares/jwtAuth.js"

export const userRouter = Router()

userRouter.route("/signup").post(registerUser)
userRouter.route("/signin").post(signIn)
userRouter.route("/signout").post(jwtVerify, signOut)

