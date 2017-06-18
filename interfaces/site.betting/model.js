var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  site: {
    type: String,
    index: true,
    unique: true
  },
  betCancelLimit: {
    type: Number
  },
  betCancelCount: {
    type: Number
  },
  kindConfig: [{
    name: {
      type: String
    },
    maxMulti: {
      type: Number
    },
    nah: { // normal and handicap
      type: Boolean
    },
    nau: { // normal and underover
      type: Boolean
    },
    hau: { // handicap and underover
      type: Boolean
    }
  }],
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
Model.statics.List = function(page, pageSize, filter, keyword, site, callback) {

  var Document = this;

  var query = {};
  if (site === '전체') {
    query.$and = [];
  } else {
    query.$and = [{
      site: site
    }];
  }

  var subquery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '사이트') {
      subquery.site = {
        $regex: '.*' + keyword + '.*'
      };
    }
  }

  if (query.$and.length > 0) {
    query.$and.push(subquery);
  } else {
    query = subquery;
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

  Document.findOne({
    site: item.site
  }, (err, doc) => {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    var timer = new Date();
    var newDoc = new Document();
    newDoc.site = item.site;
    newDoc.betCancelLimit = item.betCancelLimit;
    newDoc.betCancelCount = item.betCancelCount;
    newDoc.kindConfig = item.kindConfig;
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
    _id: item._id
  }, {
    $set: {
      betCancelLimit: item.betCancelLimit,
      betCancelCount: item.betCancelCount,
      kindConfig: item.kindConfig,
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

/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('SiteBetting', Model);
};
