var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const app = express();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', adminController.signup)

module.exports = router;
