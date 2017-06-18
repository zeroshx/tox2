var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  uid: {
    type: String,
    index: true,
    unique: true
  },
  nick: {
    type: String,
    index: true,
    unique: true
  },
  site: {
    type: String,
    index: true
  },
  memo: {
    type: String
  },
  creator: {
    type: String
  },
  createdAt: {
    type: String
  },
  modifier: {
    type: String
  },
  modifiedAt: {
    type: String
  }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/
Model.statics.List = function(page, pageSize, filter, keyword, callback) {

  var Document = this;

  var query = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '닉네임') {
      query.nick = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '사이트') {
      query.site = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '메모') {
      query.memo = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '아이디') {
      query.uid = {
        $regex: '.*' + keyword + '.*'
      };
    }
  }

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
  item,
  operator,
  callback
) {
  var Document = this;
  var timer = new Date();

  Document.findOne({
    uid: item.uid
  }, (err, doc) => {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    var newDoc = new Document();
    newDoc.uid = item.uid;
    newDoc.nick = item.nick;
    newDoc.site = item.site;
    newDoc.memo = item.memo;
    newDoc.creator = operator;
    newDoc.createdAt = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString();
    newDoc.save((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
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
    _id: item.id
  }, {
    $set: {
      memo: item.memo,
      modifier: operator,
      modifiedAt: timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
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

Model.statics.Check = function(uid, callback) {

  var Document = this;

  Document.findOne({
    uid: uid
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    callback(null, null, doc);
  });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Blacklist', Model);
};
