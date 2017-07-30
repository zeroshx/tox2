var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  operator: {
    type: String,
    index: true
  },
  work: {
    type: String
  },
  memo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800
  }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/
Model.statics.List = function(page, pageSize, callback) {

  var Document = this;

  var query = {};

  Document.count(query, (err, count) => {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      lastPage: 1,
      docs: []
    });
    Document.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort('-createdAt')
      .exec((err, docs) => {
        if (err) return callback(err);
        callback(null, null, {
          lastPage: Math.ceil(count / pageSize),
          docs: docs
        });
      });
  });
};

Model.statics.Create = function(
  operator,
  work,
  memo
) {

  var Document = this;
  var newDoc = new Document();

  newDoc.operator = operator;
  newDoc.work = work;
  newDoc.memo = memo;

  newDoc.save((err, doc) => {
    if (err) return console.error(err);
  });
};

Model.statics.Update = function(
  id,
  memo,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      memo: memo
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
  mongoose.model('Loger', Model);
};
