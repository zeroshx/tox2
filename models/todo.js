var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  importance: {
    type: String
  },
  task: {
    type: String
  },
  state: {
    type: String
  },
  registration: {
    operator: {
      type: String
    },
    date: {
      type: String
    }
  },
  completion: {
    operator: {
      type: String
    },
    date: {
      type: String
    }
  }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/
Model.statics.List = function(callback) {

  var Document = this;

  Document.find({}, function(err, docs) {
    if (err) {
      return callback(err);
    }
    return callback(null, null, {
      docs: docs
    });
  });
};

Model.statics.Create = function(
  importance,
  task,
  state,
  operator,
  callback
) {

  var Document = this;
  var moment = new Date();

  var newDoc = new Document();
  newDoc.importance = importance;
  newDoc.task = task;
  newDoc.state = state;
  newDoc.registration = {
    operator: operator,
    date: moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString()
  };
  newDoc.save(function(err) {
    if (err) {
      return callback(err);
    }
    return callback(null, null, newDoc);
  });

};

Model.statics.Update = function(
  id,
  state,
  operator,
  callback
) {

  var Document = this;
  var moment = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      state: state,
      completion: {
        operator: operator,
        date: moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString()
      }
    }
  }, {
    runValidators: true
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (doc === null) {
      return callback(null, '수정에 실패하였습니다.');
    }
    return callback(null, null, doc);
  });
};

Model.statics.Delete = function(id, callback) {

  var Document = this;

  Document.findOneAndRemove({
    _id: id
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    return callback(null, null, doc);
  });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Todo', Model);
};
