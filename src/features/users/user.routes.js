import express, { Router } from "express"
import {registerUser, signIn, signOut, signOutOfAll} from "./user.controller.js"
import jwtVerify from "../../middlewares/jwtAuth.js"

export const userRouter = Router()

userRouter.route("/signup").post(registerUser)
userRouter.route("/signin").post(signIn)
userRouter.route("/logout").post(jwtVerify, signOut)
userRouter.route("/logout-of-all-devices").post(jwtVerify, signOutOfAll)

