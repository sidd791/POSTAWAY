import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "./comment.controller.js";
import jwtVerify from "../../middlewares/jwtAuth.js"

export const commentRouter = Router();

commentRouter.route("/:postId").get(getAllComments);
commentRouter.route("/:postId").post(jwtVerify, createComment);
commentRouter.route("/:commentId").delete(jwtVerify, deleteComment);
commentRouter.route("/:commentId").put(jwtVerify, updateComment);
