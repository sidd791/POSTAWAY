import dotenv from "dotenv";
dotenv.config();
import cookieparser from "cookie-parser";
import express from "express";
import cors from "cors";
import bodyparser from "body-parser"

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json({ limit: "16kb" }));
app.use(cookieparser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

import {userRouter} from "./src/features/users/user.routes.js"
import {postRouter} from './src/features/posts/post.routes.js'
import {commentRouter} from './src/features/comments/comment.routes.js'
import { otpRouter } from "./src/features/otp/otp.routes.js";
import { friendshipRouter } from "./src/features/friendships/friendship.routes.js";
import {likeRouter} from "./src/features/likes/likes.router.js"

app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/otp", otpRouter)
app.use("/friendship", friendshipRouter)
app.use("/likes", likeRouter)

export default app;
