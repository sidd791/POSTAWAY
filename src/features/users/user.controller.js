import { User } from "./user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

var options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshTokens = async (userID) => {
  const user = await User.findById(userID);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken.push(refreshToken);
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, gender } = req.body;
  if (
    [username, email, password, gender].some(
      (field) => typeof field == "string" && field.trim() === ""
    )
  ) {
    throw new ApiError(409, "All fields are required.");
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "User already exists.");
  }
  const user = await User.create({
    email,
    username: username.toLowerCase(),
    password,
    gender,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something  went wrong while registering the user."
    );
  }
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

export const signIn = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!email && !username) {
    throw new ApiError(401, "Email or username is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(401, "User doesn't exist.");
  }
  const passwordCheck = await user.isPasswordCorrect(password);
  if (!passwordCheck) {
    throw new ApiError(401, "Incorrect password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Logged in successfully."
      )
    );
});

export const signOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        refreshToken: req.cookies.refreshToken,
      },
    },
    { new: true }
  );
  res
  .status(201)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(201, {}, "User logged out successfully."))
});
export const signOutOfAll = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      set: {
        refreshToken: [],
      },
    },
    { new: true }
  );
  res
  .status(201)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(201, {}, "User logged out successfully."))
});
