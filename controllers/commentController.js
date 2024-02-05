const Comment = require('../models/comment');
const Post = require('../models/post');
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

// Get all comments from post
exports.list = asyncHandler(async(req,res,next) => {
    const allComments = await Comment.find({post: req.params.id}).exec();
    return res.status(200).json(allComments)
})

// Create comment
exports.new_comment = [
   
    body("username").optional().trim().escape(),
    body("content", "Comment's content must be specified").trim().isLength({min: 5}).escape(),
    body("date").optional().escape(),
    
    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req);
        const comment = new Comment({
            username: req.body.username,
            content: req.body.content,
            post: req.params.id
        })
        if (!errors.isEmpty) return res.status(403).json({errors: errors.array()})
        await comment.save();
        res.sendStatus(200)

})]
// Update one comment
exports.update_comment = asyncHandler(async(req,res,next) => {
    const comment = await Comment.findById(req.params.commentid).exec()
    if(comment.username !== req.body.username) {
        await Comment.findByIdAndUpdate(req.params.commentid, {username: req.params.username}).exec()
    }
    if(comment.content !== req.body.content) {
        await Comment.findByIdAndUpdate(req.params.commentid, {content: req.params.content}).exec()
    } 
    if(comment.date !== req.body.date) {
        await Comment.findByIdAndUpdate(req.params.commentid, {date: req.params.date}).exec()
    }
    res.sendStatus(200)
})

// Delete one comment
exports.remove_comment = asyncHandler(async(req,res,next) => {
    const comment = Comment.findById(req.params.commentid).exec()
    if (!comment) return res.sendStatus(404).json({message: "Comment not found"})
    await Comment.findByIdAndDelete(req.params.commentid).exec()
    res.sendStatus(200)
})
