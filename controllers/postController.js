const Post = require('../models/post');
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

exports.list = asyncHandler(async(req,res,next) => {
    const allPosts = await Post.find({}, "title date").exec()
    res.status(200).json(allPosts)
})

exports.one_get = asyncHandler(async(req,res,next) => {
   const post = await Post.findById(req.params.id).exec()
   res.status(200).json(post);
})

exports.one_update = asyncHandler(async(req,res,next) => {
   const post = await Post.findById(req.params.id).exec()
   try {
   if (req.body.title !== post.title) {
    await Post.findByIdAndUpdate(req.params.id, {title: req.body.title}).exec()
   }
   if (req.body.text !== post.text) {
    await Post.findByIdAndUpdate(req.params.id, {text: req.body.text}).exec()
   }
   if (req.body.date !== post.date) {
    await Post.findByIdAndUpdate(req.params.id, {date: req.body.date}).exec()
   }
   if (req.body.visible !== post.visible) {
    await Post.findByIdAndUpdate(req.params.id, {visible: req.body.visible}).exec()
    return res.sendStatus(200)
   }} catch (err) {
    if(err) return res.status(400).json({message: "Error in update"})
   }
})

exports.one_create = [
    body("title", "Title should be at least 4 characters").trim().isLength({min:4}).escape(),
    body("text", "Post's content should be specified").trim().isLength({min:1}).escape(),
    body("date", "Date must be specified").isLength({min:1}).escape(),
    body("visible").optional().escape(),
    
    asyncHandler(async(req,res,next) => {
   const errors = validationResult(req);
   const post = new Post({
    title: req.body.title,
    text: req.body.text,
    date: req.body.date,
    visible: req.body.visible,
    comments: [],
   })
   if(!errors.isEmpty()){
    return res.status(400).json({post: post,errors:  errors.array()})
   }
   await post.save();
   return res.status(200).json(post._id);
})]

exports.one_delete = asyncHandler(async(req,res,next) => {
    const post = await Post.findById(req.params.id).exec();
    if (!post) return res.sendStatus(404);
    await Post.findByIdAndDelete(req.params.id).exec();
    return res.status(200).json({message: "Post deleted"})
})

