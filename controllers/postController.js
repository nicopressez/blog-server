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
   
})

exports.one_create = [
    body("title").trim().isLength({min:4}).escape(),
    body("text").trim().isLength({min:1}).escape(),
    body("date").isLength({min:1}).escape(),
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

})

