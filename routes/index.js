// basic modules
var express = require('express');
var router = express.Router();

// controller
var ctrl = require('../controllers/index.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
