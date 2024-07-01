import Router from "express"
import jwtVerify from "../../middlewares/jwtAuth.js"
import {toggleLike, getLikes} from "./like.controller.js"
export const likeRouter = Router()

likeRouter.route("/toggle/:id").get(jwtVerify, toggleLike)
likeRouter.route("/:id").get(jwtVerify, getLikes)