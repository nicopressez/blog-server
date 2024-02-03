var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')
const app = express();
require("dotenv").config()
const jwt = require("jsonwebtoken");

const verifyToken  = (req,res,next) => {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
   const bearerToken = bearerHeader.split(' ')[1];
   req.token = bearerToken;
   next();
  } else {
   return res.status(404).json({message: "Error in token verification"})
  }
}

const verifyAdmin = (req,res,next) => {
  jwt.verify(req.token, process.env.SECRET, (err, data) => {
    if(err) return res.status(404).json("Problem with JWT verification");
    else if (!data.isAdmin) return res.status(403).json({message: "forbidden"})
    else next()
    })
   
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Authentication routes
router.post('/signup', adminController.signup)
router.post('/login', adminController.login)
router.post('/logout', adminController.logout)

// Get all posts
router.get('/posts', postController.list)

// Get one post
router.get('/posts/:id', postController.one_get)

// Create one post
router.post('/posts',verifyToken, verifyAdmin,postController.one_create )

// Update one post
router.patch('/posts/:id', verifyToken, verifyAdmin, postController.one_update)

// Delete one post
router.delete('/posts/:id', verifyToken, verifyAdmin, postController.one_delete)

// Get all comments
router.get('/posts/:id/comments', commentController.list )

// Add comment
router.post('/posts/:id/comments', commentController.new_comment)

// Update comment
router.patch('/posts/:id/comments/:commentid', verifyToken, verifyAdmin, commentController.update_comment)

//Delete comment
router.delete('/posts/:id/comments/:commentid', verifyToken, verifyAdmin, commentController.remove_comment)
module.exports = router;
