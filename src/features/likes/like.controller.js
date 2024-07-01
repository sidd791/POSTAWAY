import {Like} from "./like.schema.js"
import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import {Post} from "../posts/post.schema.js"
import {Comment} from "../comments/comment.schema.js"

export const toggleLike = asyncHandler(async(req, res)=>{
    const id = req.params.id
    const userId = req.user.id
    const {type} = req.query
    if (!id || !userId || !type) {
        throw new ApiError(404, "Id or userId or type not foud")
    }
    const existingLike = await Like.findOne({
        userId,
        likeable: id,
        onModel : type
    })
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        if (type === 'Post') {
            const post = await Post.findByIdAndUpdate(
                id,
                {$pull : {postLikes : existingLike._id}},
                {new : true}
            )
            if (!post) {
                throw new ApiError(402, "Post not found")
            }
        }
        if (type === 'Comment') {
            const comment = await Comment.findByIdAndUpdate(
                id,
                {$pull : {commentLikes : existingLike._id}},
                {new : true}
            )
            if (!comment) {
                throw new ApiError(402, "Comment not found")
            }
        }
    }else {
        const like = await Like.create({userId, likeable: id, onModel : type})
        if (type === 'Post') {
            const post = await Post.findByIdAndUpdate(
                id,
                {$push : {postLikes : like._id}},
                {new : true}
            )
        }
        if (type === 'Comment') {
            const comment = await Comment.findByIdAndUpdate(
                id,
                {$push : {commentLikes : like._id}},
                {new : true}
            )
        }
    }
    res.status(200).json(200, "Like Toggled")
})

export const getLikes = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const like = await Like.find({likeable : id}).populate('userId')
    if (!like) {
        throw new ApiError(400, "Error in getting Like")
    }
    res.status(200).json(200, like, "Get likes.")
})