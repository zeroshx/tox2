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
  domain: {
    type: String
  },
  ip: {
    type: String
  },
  state: {
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
Model.statics.List = function(page, pageSize, filter, keyword, state, site, callback) {

  var Document = this;

  var query = {};
  if (state === '전체') {
    query.$and = [];
  } else {
    query.$and = [{
      state: state
    }];
  }

  if (site !== '전체') {
    query.$and.push({
      site: site
    });
  }

  var subquery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '아이디') {
      subquery = {
        uid: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '닉네임') {
      subquery = {
        nick: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '아이피') {
      subquery = {
        ip: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '도메인') {
      subquery = {
        domain: {
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

Model.statics.Create = function(
  uid,
  nick,
  site,
  domain,
  ip,
  state,
  callback
) {
  var Document = this;
  var newDoc = new Document();

  newDoc.uid = uid;
  newDoc.nick = nick;
  newDoc.site = site;
  newDoc.domain = domain;
  newDoc.ip = ip;
  newDoc.state = state;
  newDoc.save((err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Update = function(
  id,
  nick,
  site,
  state,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      nick: nick,
      site: site,
      state: state
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
  mongoose.model('UserHistory', Model);
};
