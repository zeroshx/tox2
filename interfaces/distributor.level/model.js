var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  name: {
    type: String,
    index: true
  },
  order: {
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
    if (filter === '레벨명') {
      query.name = {
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
      .sort('order')
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
  callback
) {
  var Document = this;

  Document.findOne({
    $or: [{
      name: item.name
    }, {
      order: item.order
    }]
  }, function(err, doc) {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    var newDoc = new Document();

    newDoc.name = item.name;
    newDoc.order = item.order;
    newDoc.maxHeadcount = item.maxHeadcount;
    newDoc.statusPoint = item.statusPoint;
    newDoc.requirement = item.requirement;

    newDoc.save((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
  });
};

Model.statics.Update = function(
  item,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: item._id
  }, {
    $set: {
      maxHeadcount: item.maxHeadcount,
      statusPoint: item.statusPoint,
      requirement: item.requirement
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

Model.statics.ListAll = function(callback) {

  var Document = this;

  Document.find({})
    .sort('order')
    .exec((err, docs) => {
      if (err) return callback(err);
      callback(null, null, docs);
    });
};

Model.statics.GetInitLevel = function(callback) {

  var Document = this;

  Document.find({})
    .sort('order')
    .exec((err, docs) => {
      if (err) return callback(err);
      if (docs.length === 0) return callback(null, 'not-found');
      callback(null, null, docs[0]);
    });
};

Model.statics.GetCurLevel = function(curOrder, callback) {

  var Document = this;

  Document.findOne({
      order: order
    }, (err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(err, 'not-found');
      callback(null, null, doc);
    });
};

Model.statics.GetNextLevel = function(curOrder, callback) {

  var Document = this;

  Document.find({
      order: {
        $gt: curOrder
      }
    })
    .sort('order')
    .exec((err, docs) => {
      if (err) return callback(err);
      if (docs.length === 0) return callback(null, 'not-found');
      callback(null, null, docs[0]);
    });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('DistributorLevel', Model);
};
