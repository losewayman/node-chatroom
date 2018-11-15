var express = require('express');
var router = express.Router();
var query = require("../mysql.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.type('html');
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.type('html');
  res.render('index');
});


module.exports = router;
