import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  getPostByUserId,
  updatePost,
} from "./post.controller.js";
import jwtVerify from "../../middlewares/jwtAuth.js";

export const postRouter = Router();

postRouter.route("/all").get(getAllPosts);
postRouter
  .route("/")
  .post(jwtVerify, upload.single("imageUrl"), createPost);
postRouter.route("/:postId").get(getOnePost);
postRouter.route("/").get(getPostByUserId);
postRouter.route("/:postId").delete(jwtVerify, deletePost);
postRouter
  .route("/:postId")
  .put(jwtVerify, upload.single("imageUrl"), updatePost);
