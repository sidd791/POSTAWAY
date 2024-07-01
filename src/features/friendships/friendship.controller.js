import { Friendship } from "./friendship.schema.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const toggleFriendship = asyncHandler(async(req, res)=>{
    const userId  = req.user._id;
    const friendId = req.params.id
    if (userId === friendId) {
        throw new ApiError(400, "Cant send a friend req to yourself")
    }
    const existingFriendship = await Friendship.findOneAndDelete({
        $or : [
            { userId: userId, friendId: friendId , status : 'accepted'},
            { userId: friendId, friendId: userId , status : 'accepted'}
        ]
    })
    if (existingFriendship) {
        return res.status(200).json(new ApiResponse(200, "Friend Request Deleted"))
    }else{
        const pendingFriendship = await Friendship.findOne({
            $or : [
                { user1: userId, user2: friendId , status : 'pending'},
                { user1: friendId, user2: userId , status : 'pending'}
            ]
        })
        if (pendingFriendship) {
            throw new ApiError(400, "Friend req pending, accept or reject it.")
        }
    }
    const newFriendship = await Friendship.create({
       userId,
       friendId,
       status : "pending"
    })
    res.status(200).json(new ApiResponse(200, newFriendship, "Friend Requested Sent"))
})

export const respondToRequest = asyncHandler(async(req, res)=>{
    let updatedStatus
    const userId  = req.user._id;
    const friendId = req.params.id
    const {status} = req.query
    if (status = "accept") {
        updatedStatus = "accepted"
        const friendship = await Friendship.findOneAndUpdate(
            {userId, friendId, status : "pending"},
            {$push : {status : updatedStatus}},
            {new : true}
        )
        if (friendship) {
            return res.status(200).json(new ApiResponse(200, friendship, "Friend req accepted"))
        }else{
            throw new ApiError(400, "Friend req not found")
        }
    } else if (status = "reject") {
        updatedStatus = "rejected"
        const friendship = await Friendship.findOneAndUpdate(
            {userId, friendId, status : "pending"},
            {$push : {status : updatedStatus}},
            {new : true}
        )
        if (friendship) {
            return res.status(200).json(new ApiResponse(200, friendship, "Friend req rejected"))
        }
    }else{
        throw new ApiError(400, "Invalid status")
    }
})

export const getPendingRequests = asyncHandler(async(req, res)=>{
    const userId = req.user._id
    const pendingRequests = await Friendship.find({userId, status : "pending"})
    if (!pendingRequests) {
        throw new ApiError(400, "Error in getting pending requests")
    }
    res.status(200).json(new ApiResponse(200, pendingRequests, "Pending requestds fetched"))
})

export const getUserFriends = asyncHandler(async(req, res)=>{
    const userId = req.user._id
    const friends = await Friendship.find({userId, status : "accepted"})
    if (!friends) {
        throw new ApiError(400, "Error in getting friends")
    }
    res.status(200).json(new ApiResponse(200, friends, "Friends fetched"))
})