var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  signup: {
    bonus: {
      phone: {
        type: Number
      },
      email: {
        type: Number
      }
    }
  },
  distributor: {
    setup: {
      statusPoint: {
        type: Number
      }
    },
    level: [{
      name: {
        type: Number
      },
      maxHeadcount: {
        type: Number
      },
      statusPoint: {
        type: Number
      },
      requirement: {
        type: Number
      }
    }]
  },
  modifiedAt: {
    type: String
  }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/
Model.statics.One = function(callback) {

  var Document = this;

  Document.findOne({}, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    callback(null, null, doc);
  });
};

Model.statics.Upsert = function(
  bonusPhone,
  bonusEmail,
  statusPoint,
  level,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.update({}, {
    $set: {
      'signup.bonus': {
        phone: bonusPhone,
        email: bonusEmail,
      },
      'distributor.setup': {
        statusPoint: statusPoint
      },
      'distributor.level': level,
      modifiedAt: timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
    }
  }, {
    upsert: true
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.GetSingupConfig = function(callback) {

  var Document = this;

  Document.findOne({}, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    callback(null, null, doc.signup);
  });
};

Model.statics.GetDistributorSetupConfig = function(callback) {

  var Document = this;

  Document.findOne({}, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    callback(null, null, doc.distributor.setup);
  });
};

Model.statics.GetDistributorLevelConfig = function(callback) {

  var Document = this;

  Document.findOne({}, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    callback(null, null, doc.distributor.level);
  });
};



/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Manager', Model);
};
