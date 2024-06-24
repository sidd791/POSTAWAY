import mongoose, { Schema } from "mongoose"

const postSchema = Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    imageUrl : {
        type: String,
        required: [true, "Image url is required."]
    },
    caption : {
        type: String,
        required: true
    },
    postLikes : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Like',
    },
    postComments : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }
}, {timestamps : true})

export const Post = mongoose.model("Post", postSchema)