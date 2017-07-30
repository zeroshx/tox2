var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  realtime: {
    deposit: {
      type: Number,
      default: 0
    },
    withdrawal: {
      type: Number,
      default: 0
    },
    question: {
      type: Number,
      default: 0
    }
  },
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
  messenger: {
    room: [{
      name: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
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

Model.statics.SetSignupConfig = function(
  item,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({}, {
    $set: {
      signup: item
    }
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

Model.statics.AddMessengerRoom = function(
  item,
  callback
) {

  var Document = this;

  Document.findOne({
    'messenger.room': {
      $elemMatch: {
        name: item.name
      }
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    Document.findOneAndUpdate({}, {
      $addToSet: {
        'messenger.room': {
          name: item.name
        }
      }
    }, (err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
  });
};

Model.statics.RemoveMessengerRoom = function(
  id,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({}, {
    $pull: {
      'messenger.room': {
        _id: id
      }
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.IncDepositCase = function(callback) {

  var Document = this;

  Document.findOneAndUpdate({}, {
    $inc: {
      'realtime.deposit': 1
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ResetDepositCase = function(callback) {

  var Document = this;

  Document.findOneAndUpdate({}, {
    $set: {
      'realtime.deposit': 0
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.IncWithdrawalCase = function(callback) {

  var Document = this;

  Document.findOneAndUpdate({}, {
    $inc: {
      'realtime.withdrawal': 1
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ResetWithdrawalCase = function(callback) {

  var Document = this;

  Document.findOneAndUpdate({}, {
    $set: {
      'realtime.withdrawal': 0
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.IncQuestionCase = function(callback) {

  var Document = this;

  Document.findOneAndUpdate({}, {
    $inc: {
      'realtime.question': 1
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ResetQuestionCase = function(callback) {

  var Document = this;

  Document.findOneAndUpdate({}, {
    $set: {
      'realtime.question': 0
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Manager', Model);
};
