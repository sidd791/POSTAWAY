import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  getPostByUserId,
  updatePost,
} from "./post.controller.js";
import jwtVerify from "../../middlewares/jwtAuth.js";
import { upload } from "../../middlewares/multer.middleware.js";

export const postRouter = Router();

postRouter.route("/all").get(getAllPosts);
postRouter
  .route("/create")
  .post(jwtVerify, upload.single("imageUrl"), createPost);
postRouter.route("/:postId").get(getOnePost);
postRouter.route("/").get(getPostByUserId);
postRouter.route("/delete/:postId").post(jwtVerify, deletePost);
postRouter
  .route("/update")
  .post(jwtVerify, upload.single("imageUrl"), updatePost);
