const passport = require("../passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const Admin = require('../models/admin');
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
require("dotenv").config()


exports.signup = [
    body("username", "Invalid username")
        .trim()
        .isLength({min: 1})
        .escape()
        .custom(async(username) => {
            try {
                const existingUsername = await Admin.findOne({username:username}).exec();
                if (existingUsername) {
                    throw new Error("username already in use")
                }
                return true;
            } catch(err) {
                throw new Error("Error in username validation")
            }
        }),
    body("password", "Password invalid").isLength({min: 6}),
    body("confirm-password", "Passwords don't match").custom((value, { req }) => {
        if (value !==req.body.password){
            return next("Passwords don't match")
        }
        return true;
    }), 
      asyncHandler(async(req,res,next) => {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) =>{
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
})
})]


exports.login = [
    passport.authenticate("local"),
    asyncHandler(async(req,res,next) => {
        const user = req.user.username;
        const isAdmin = req.user.admin;
        const secret = process.env.SECRET;
        const token = jwt.sign({ user, isAdmin}, secret, { expiresIn: "24h"});
        return res.status(200).json({
            message: "Auth passed",
            token
        })

})]

exports.logout = asyncHandler(async(req,res,next) => {
    req.logout((err) => {
        if (err) return res.status(500).json({message: "Can't log out"})
        res.status(200).json({message: "Log out successful"})
    }
    )
})