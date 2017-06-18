var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  name: {
    type: String,
    unique: true,
    index: true
  },
  country: {
    type: String,
    index: true
  },
  imagePath: {
    type: String
  },
  createdAt: {
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
    if (filter === '리그') {
      query.name = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '국가') {
      query.country = {
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
    callback(null, null, {
      docs: docs
    });
  });
};

Model.statics.Create = function(name, country, imagePath, callback) {

  var Document = this;

  Document.findOne({
    name: name
  }, (err, doc) => {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    var newDoc = new Document();
    var timer = new Date();
    newDoc.name = name;
    newDoc.country = country;
    newDoc.imagePath = imagePath;
    newDoc.createdAt = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString();
    newDoc.modifiedAt = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString();
    newDoc.save((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, newDoc);
    });
  });
};

Model.statics.Update = function(id, country, imagePath, callback) {

  var Document = this;
  var timer = new Date();

  var query = {
    $set: {
      country: country,
      modifiedAt: timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
    }
  };

  if (typeof(imagePath) === 'string' && imagePath.length > 0) {
    query.$set.imagePath = imagePath;
  } else {
    query.$set.imagePath = undefined;
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
  mongoose.model('MatchLeague', Model);
};
