import express, { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  registerUser,
  signIn,
  signOut,
  signOutOfAll,
  updateUser,
} from "./user.controller.js";
import jwtVerify from "../../middlewares/jwtAuth.js";

export const userRouter = Router();

userRouter.route("/signup").post(registerUser);
userRouter.route("/signin").post(signIn);
userRouter.route("/logout").post(jwtVerify, signOut);
userRouter.route("/logout-of-all-devices").post(jwtVerify, signOutOfAll);
userRouter.route("/get-details/:id").post(jwtVerify, getSingleUser);
userRouter.route("/get-all-details").post(jwtVerify, getAllUsers);
userRouter.route("/update-details/:id").post(jwtVerify, updateUser);
