import { Router } from "express";
import { createPost, getAllPosts } from "./post.controller.js";
import jwtVerify from '../../middlewares/jwtAuth.js'
import {upload} from '../../middlewares/multer.middleware.js'

export const postRouter = Router()

postRouter.route('/all').get(getAllPosts)
postRouter.route('/create').post(jwtVerify, upload.single('imageUrl'), createPost)