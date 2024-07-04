import { User } from "../users/user.model.js";
import { Post } from "./post.schema.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getAllPosts = asyncHandler(async (req, res) => {
  const allPosts = await Post.find();
  if (!allPosts) {
    throw new ApiError(404, "Error in getting all posts.");
  }
  if (allPosts.length > 0) {
    res.status(200).json(new ApiResponse(200, allPosts));
  } else {
    res.status(404).send("No posts found");
  }
});

export const getOnePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Error in finding post.");
  }
  res.status(200).json(new ApiResponse(200, post, "Post found."));
});

export const createPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const userId = req.user._id;
  const imageUrl = req.file.path;


  // Log the request body and file for debugging
  console.log("Request Body:", req.body);
  console.log("User ID : ", userId);
  console.log("Uploaded File:", req.file);
  // Basic validation
  if (!caption || !imageUrl || !userId) {
    throw new ApiError(400, "All fields are required.");
  }

  // Create a new post
  const post = await Post.create({
    userId,
    imageUrl,
    caption,
  });
  const newPost = await Post.findById(post._id);
  if (!newPost) {
    throw new ApiError(404, "Error in new Post");
  }
  res.status(201).json(new ApiResponse(201, newPost, "Post created"));
});

export const getPostByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const posts = await Post.find({ userId });
  if (!posts) {
    throw new ApiError(404, "Error in finding posts by user ID.");
  }
  res.status(200).json(new ApiResponse(200, posts, "All posts by user."));
});

export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  const post = await Post.findById(postId);
  if (!userId) {
    throw new ApiError(404, "Error in finding post.");
  }
  await Post.findByIdAndDelete(postId);
  res.status(200).json(new ApiResponse(200, post, "Post deleted"));
});

export const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  const post = await Post.findById(postId);

  if (!post) {
      throw new ApiError(404, "Post not found");
  }
  if (post.userId !== userId) {
      throw new ApiError(403, "Unauthorized");
  }

  // Update the post
  post.caption = req.body.caption;
  post.imageUrl = req.body.imageUrl;
  await post.save();
  res.status(200).json(new ApiResponse(200, post, "Post updated."));
});

