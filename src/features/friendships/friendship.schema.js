import mongoose, { Schema } from "mongoose"

const friendshipSchema = Schema({
    userId : {
        type : String,
        required : true
    },
    friendId : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "accepted", "rejected"]
    }
})

export const Friendship = mongoose.model("Friendship", friendshipSchema)