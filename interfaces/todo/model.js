var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  importance: {
    type: String
  },
  order: {
    type: Number
  },
  project: {
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
      type: Date,
      default: Date.now
    }
  },
  completion: {
    operator: {
      type: String
    },
    date: {
      type: Date
    }
  }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/
Model.statics.List = function(callback) {

  var Document = this;

  Document.find({}, (err, docs) => {
    if (err) return callback(err);
    callback(null, null, {
      docs: docs
    });
  });
};

Model.statics.Create = function(
  item,
  operator,
  callback
) {

  var Document = this;

  var newDoc = new Document();
  newDoc.importance = item.importance;
  if(item.importance === '낮음') {
    newDoc.order = 1;
  } else if(item.importance === '보통') {
    newDoc.order = 2;
  } else {
    newDoc.order = 3;
  }
  newDoc.project = item.project;
  newDoc.task = item.task;
  newDoc.state = item.state;
  newDoc.registration = {
    operator: operator
  };
  newDoc.save((err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });

};

Model.statics.Update = function(
  item,
  operator,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: item._id
  }, {
    $set: {
      state: item.state,
      completion: {
        operator: operator,
        date: timer.getTime()
      }
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Delete = function(id, callback) {

  var Document = this;

  Document.findOneAndRemove({
    _id: id
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
  mongoose.model('Todo', Model);
};
