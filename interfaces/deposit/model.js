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
  holder: {
    type: String,
    index: true
  },
  site: {
    type: String,
    index: true
  },
  distributor: {
    type: String,
    index: true
  },
  cash: {
    type: Number
  },
  state: {
    type: String
  },
  operator: {
    type: String
  },
  createdAt: {
    type: String
  },
  operatedAt: {
    type: String
  },
  modifiedAt: {
    type: String
  }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/
Model.statics.List = function(page, pageSize, filter, keyword, site, distributor, state, callback) {

  var Document = this;

  var query = {};
  if (site === '전체') {
    query.$and = [];
  } else {
    query.$and = [{
      site: site
    }];
  }

  if (distributor !== '전체') {
    query.$and.push({
      distributor: distributor
    });
  }

  if (state !== '전체') {
    query.$and.push({
      state: state
    });
  }

  var subquery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '예금주') {
      subquery = {
        holder: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '닉네임') {
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
    }
    // else if (filter === '사이트') {
    //   subquery = {
    //     site: {
    //       $regex: '.*' + keyword + '.*'
    //     }
    //   };
    // } else if (filter === '총판') {
    //   subquery = {
    //     distributor: {
    //       $regex: '.*' + keyword + '.*'
    //     }
    //   };
    // }
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

Model.statics.CustomerList = function(page, pageSize, uid, callback) {

  var Document = this;

  Document.count({
    uid: uid
  }, (err, count) => {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      lastPage: 0,
      docs: []
    });
    Document.find({
        uid: uid
      })
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
  holder,
  site,
  distributor,
  cash,
  state,
  callback
) {
  var Document = this;
  var timer = new Date();
  var newDoc = new Document();

  newDoc.uid = uid;
  newDoc.nick = nick;
  newDoc.holder = holder;
  newDoc.site = site;
  newDoc.distributor = distributor;
  newDoc.cash = cash;
  newDoc.state = state;
  newDoc.createdAt = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString();
  newDoc.save((err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Update = function(
  id,
  nick,
  holder,
  site,
  distributor,
  cash,
  state,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      nick: nick,
      holder: holder,
      site: site,
      distributor: distributor,
      cash: cash,
      state: state,
      modifiedAt: timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ChangeState = function(
  id,
  state,
  operator,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      state: state,
      operator: operator,
      operatedAt: timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
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

Model.statics.CheckState= function(id, state, callback) {

  var Document = this;

  Document.findOne({
    _id: id
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    if (doc.state !== state) return callback(null, 'processed');
    callback(null, null, doc);
  });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Deposit', Model);
};
