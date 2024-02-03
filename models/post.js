const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {type: String, minLength: 4, required:true},
    text: {type: String, minLength: 4, required:true},
    date: {type: Date, required:true},
    visible: {type: Boolean, default: false},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:"Comment"}]
});

module.exports = mongoose.model("Post", PostSchema);