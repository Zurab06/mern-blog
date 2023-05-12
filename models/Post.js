import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    text: {
        type: String, required: true
    },
    tags: {
        type: Array, default: [],
    },
    imageUrl: String,
    viewsCount: {
        type: Number,
        default: 0
    },
    title: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'
    },

}, {
    timestamps: true
})

export default mongoose.model('Post', PostSchema)