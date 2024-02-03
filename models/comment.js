const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    username: {type: String, minLength: 3, maxLength: 20},
    content: {type: String, required:true},
    date: {type: Date, default: new Date}
})

module.exports = mongoose.model("Comment", CommentSchema);