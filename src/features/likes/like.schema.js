import mongoose, { Schema } from "mongoose"

const likeSchema = Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    likeable : {
        type : mongoose.Schema.Types.ObjectId,
        refPath : 'onModel'
    },
    onModel : {
        type : String,
        required : true,
        enum : ['Post', 'Comment']
    }
})

export const Like = mongoose.model("Like", likeSchema)