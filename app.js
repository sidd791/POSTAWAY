import dotenv from "dotenv";
dotenv.config();
import cookieparser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" }));
app.use(cookieparser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

import {userRouter} from "./src/features/users/user.routes.js"
app.use("/api/user", userRouter);

export default app;
