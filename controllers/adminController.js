const passport = require("../passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const Admin = require('../models/admin');
const { body, validationResult} = require('express-session');
const asyncHandler = require('express-async-handler');

exports.signup = [
    body("username")
        .trim()
        .isLength({min: 1})
        .escape()
        .custom(async(username) => {
            try {
                const existingUsername = await Admin.findOne({username:username});
                if (existingUsername) {
                    throw new Error("username already in use")
                }
            } catch(err) {
                throw new Error(err)
            }
        }),
    body("password").isLength({min: 6}),
    body("confirm-password").custom((value, { req }) => {
        if (value !==req.body.password){
            return next("Passwords don't match")
        }
        return true;
    }),
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) return res.status(404).json();
      asyncHandler(async(req,res,next) => {
        const errors = validationResult(req);
        const admin = new Admin ({
            username: req.body.username,
            password: hashedPassword,
        })

        if(!errors.isEmpty()) {
            return res.status(409).json({username: req.body.username, errors: errors.array()})
        }
        const newadmin = await admin.save();
        res.status(200).json(newadmin.username);
    });
})]

exports.login = asyncHandler(async(req,res,next) => {

})

exports.logout = asyncHandler(async(req,res,next) => {
    
})