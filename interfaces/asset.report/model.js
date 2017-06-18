var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  uid: {
    type: String,
    index: true
  },
  nick: {
    type: String,
    index: true
  },
  site: {
    type: String,
    index: true
  },
  before: {
    cash: {
      type: Number
    },
    chip: {
      type: Number
    },
    point: {
      type: Number
    },
    debt: {
      type: Number
    },
  },
  after: {
    cash: {
      type: Number
    },
    chip: {
      type: Number
    },
    point: {
      type: Number
    },
    debt: {
      type: Number
    },
  },
  match: {
    type: Schema.Types.ObjectId,
    ref: 'Match'
  },
  memo: {
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
  if (keyword) {
    if (filter === '닉네임') {
      subquery = {
        nick: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '아이디') {
      subquery = {
        uid: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '메모') {
      subquery = {
        memo: {
          $regex: '.*' + keyword + '.*'
        }
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

Model.statics.ListForUser = function(mode, target, callback) {

  var Document = this;

  var query = {};
  if(mode === 'UID') {
    query.uid = target;
  } else if(mode === 'NICK') {
    query.nick = target;
  }

  Document.find(query)
    .limit(20)
    .sort('-createdAt')
    .exec((err, docs) => {
      if (err) return callback(err);
      callback(null, null, {
        docs: docs
      });
    });
};

Model.statics.Create = function(
  item,
  callback
) {
  var Document = this;
  var timer = new Date();
  var newDoc = new Document();

  newDoc.uid = item.uid;
  newDoc.nick = item.nick;
  newDoc.site = item.site;
  newDoc.before = item.before;
  newDoc.after = item.after;
  newDoc.match = item.match;
  newDoc.memo = item.memo;
  newDoc.createdAt = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString();

  newDoc.save((err, doc) => {
    if(err) return callback(err);
    if(!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Update = function(
  item,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: item._id
  }, {
    $set: {
      before: item.before,
      after: item.after,
      match: item.match,
      memo: item.memo,
      modifiedAt: timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if(!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Delete = function(id, callback) {

  var Document = this;

  Document.findOneAndRemove({
    _id: id
  }, (err, doc) => {
    if (err) return callback(err);
    if(!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('AssetReport', Model);
};
