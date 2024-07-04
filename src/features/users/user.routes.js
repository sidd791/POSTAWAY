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
userRouter.route("/logout").get(jwtVerify, signOut);
userRouter.route("/logout-all-devices").get(jwtVerify, signOutOfAll);
userRouter.route("/get-details/:id").get(jwtVerify, getSingleUser);
userRouter.route("/get-all-details").get(jwtVerify, getAllUsers);
userRouter.route("/update-details/:id").put(jwtVerify, updateUser);
