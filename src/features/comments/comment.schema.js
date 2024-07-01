import mongoose from "mongoose"

const commentSchema = mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post',
    },
    commentLikes : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Like"
    },
}, {timestamps : true})

export const Comment = mongoose.model("Comment", commentSchema)