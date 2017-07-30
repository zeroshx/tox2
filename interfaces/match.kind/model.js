var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  name: {
    type: String,
    unique: true,
    index: true
  },
  group: {
    type: String,
    index: true
  },
  imagePath: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/
Model.statics.List = function(page, pageSize, filter, keyword, callback) {

  var Document = this;

  var query = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '종목') {
      query.name = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '그룹') {
      query.group = {
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

Model.statics.ListAll = function(callback) {

  var Document = this;

  Document.find((err, docs) => {
    if (err) return callback(err);
    callback(null, null, docs);
  });
};

Model.statics.Create = function(name, group, imagePath, callback) {

  var Document = this;

  Document.findOne({
    name: name
  }, (err, doc) => {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    var newDoc = new Document();
    newDoc.name = name;
    newDoc.group = group;
    newDoc.imagePath = imagePath;
    newDoc.save((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
  });
};

Model.statics.Update = function(id, group, imagePath, callback) {

  var Document = this;

  var query = {
    $set: {
      group: group
    }
  };

  if (typeof(imagePath) === 'string' && imagePath.length > 0) {
    query.$set.imagePath = imagePath;
  }

  Document.findOneAndUpdate({
    _id: id
  }, query, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Delete = function(id, callback) {

  var Document = this;

  Document.findOneAndRemove({
    _id: id
  }, function(err, doc) {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('MatchKind', Model);
};
