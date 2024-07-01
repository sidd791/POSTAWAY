import {Comment} from "./comment.schema.js"
import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import {Post} from "../posts/post.schema.js"

export const createComment = asyncHandler(async(req, res)=>{
    const userId = req.user._id
    const postId = req.params.postId
    const content = req.body.content

    if (!userId || !postId || !content) {
        throw new ApiError(404, "User Id or post ID or content not found")
    }
    const comment = {
        userId,
        postId,
        content
    }
    const post = await Post.findByIdAndUpdate(
        {_id : postId},
        {$push : {postComments : comment.content}},
        {new : true}
    )
    if (!comment) {
        throw new ApiError(401, "Error in finding post")
    }

    const newComment = await Comment.create(comment)
    res.status(200).json(new ApiResponse(200, newComment, "Commented successfully."))
})

export const getAllComments = asyncHandler(async(req,res)=>{
    const postId = req.params.postId
    const comments = await Comment.find({postId})
    if (!comments) {
        throw new ApiError(401, "Error in finding comments")
    }
    res.status(201).json(new ApiResponse(201, comments, "All comments"))
})

export const deleteComment = asyncHandler(async(req, res)=>{
    const commentId = req.params.commentId
    const deletedComment = await Comment.findById(commentId)
    if (!deletedComment) {
        throw new ApiError(401, "Comment not found")
    }
    await Post.findByIdAndUpdate(
        {_id : deletedComment.postId},
        {$pull : {postComments : deletedComment._id}}
    )
    await Comment.findByIdAndDelete(commentId)
    res.status(200).json(new ApiResponse(200, deletedComment, "Comment deleted."))
})

export const updateComment = asyncHandler(async(req, res)=>{
    const commentId = req.params.commentId
    const content = req.body.content
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(401, "Comment not found")
    }
    comment.content = content
    await Post.findByIdAndUpdate(
        {_id : comment.postId},
        {$pull : {postComments : comment._id}}
    )
    await Post.findByIdAndUpdate(
        {_id : comment.postId},
        {$push : {postComments : comment._id}}
    )
    const updatedComment = comment.save()
    res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated."))
})