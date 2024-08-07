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
    username,
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
    .json(new ApiResponse(201, {}, "User logged out successfully."));
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
    .json(new ApiResponse(201, {}, "User logged out successfully."));
});

export const getSingleUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse(200, user, "User found."));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({}).select("-password -refreshToken");
  if (!allUsers) {
    throw new ApiError(404, "No users found");
  }
  res.status(200).json(new ApiResponse(200, allUsers, "All users found"));
});


export const updateUser = asyncHandler(async (req, res) => {
  const  id  = req.params.id;
  const updateData = req.body;

  // Validate if the update data contains empty fields
  for (const key in updateData) {
    if (typeof updateData[key] === "string" && updateData[key].trim() === "") {
      throw new ApiError(400, `Field ${key} cannot be empty.`);
    }
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Only update the fields that are provided
  for (const key in updateData) {
    if (updateData.hasOwnProperty(key)) {
      user[key] = updateData[key];
    }
  }

  await user.save({ validateBeforeSave: true });

  const updatedUser = await User.findById(id).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});
