const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    username: {type: String, default: "Anonymous", maxLength: 20},
    content: {type: String, required:true},
    date: {type: Date, default: new Date},
    post: {type: mongoose.Schema.Types.ObjectId, ref:"post" }
})

module.exports = mongoose.model("Comment", CommentSchema);