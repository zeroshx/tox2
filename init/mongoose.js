var mongoose = require('mongoose');
var mongfig = require('../config/mongoose.js');

module.exports = function () {
  var mdb = mongoose.connect(mongfig.url);
  return mdb;
};
