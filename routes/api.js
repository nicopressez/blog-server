var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
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
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', adminController.signup)

router.post('/login', adminController.login)

router.post('/logout', adminController.logout)

router.post('/private', verifyToken, (req,res,next) => {
   jwt.verify(req.token, process.env.SECRET, (err, data) => {
    if(err) return res.status(404).json("Problem with JWT verification");
    else {
      if (!data.isAdmin) return res.status(403).json({message: "forbidden"})
      res.json({
        message: "Authorized",
        data,
      })
    }
   })
})

module.exports = router;
