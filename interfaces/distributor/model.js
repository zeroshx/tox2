var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  name: {
    type: String,
    index: true,
    unique: true
  },
  site: {
    type: String,
    index: true
  },
  manager: {
    uid: {
      type: String,
      index: true
    },
    nick: {
      type: String,
      index: true
    }
  },
  level: {
    type: Number
  },
  contribution: {
    type: Number
  },
  statusPoint: {
    type: Number
  },
  bonus: {
    win: {
      type: Number
    },
    lose: {
      type: Number
    }
  },
  headcount: {
    type: Number
  },
  joinStyle: {
    type: String
  },
  awaiter: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  memo: {
    type: String
  },
  creator: {
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
    if (filter === '총판장') {
      subquery.$or = [{
        'manager.uid': {
          $regex: '.*' + keyword + '.*'
        }
      }, {
        'manager.nick': {
          $regex: '.*' + keyword + '.*'
        }
      }];
    } else if (filter === '총판명') {
      subquery.name = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '메모') {
      subquery.memo = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '총판+메모') {
      subquery.$or = [{
        name: {
          $regex: '.*' + keyword + '.*'
        }
      }, {
        memo: {
          $regex: '.*' + keyword + '.*'
        }
      }];
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
      .sort('createdAt')
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
    name: item.name
  }, (err, doc) => {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    var newDoc = new Document();
    newDoc.name = item.name;
    newDoc.site = item.site;
    newDoc.manager = item.manager;
    newDoc.bonus = item.bonus;
    newDoc.joinStyle = item.joinStyle;
    newDoc.memo = item.memo;
    newDoc.headcount = 0;
    newDoc.creator = operator;
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
      manager: item.manager,
      bonus: item.bonus,
      joinStyle: item.joinStyle,
      memo: item.memo
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.CustomerUpdate = function(
  id,
  joinStyle,
  memo,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      joinStyle: joinStyle,
      memo: memo
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ModifyHeadcount = function(
  id,
  value,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $inc: {
      headcount: value
    }
  }, {
    new: true
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.SetDistributorExtra = function(
  id,
  level,
  statusPoint,
  contribution,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      level: level,
      statusPoint: statusPoint,
      contribution: contribution
    }
  }, {
    new: true
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
    .select('name')
    .exec((err, docs) => {
      if (err) return callback(err);
      callback(null, null, docs);
    });
};

Model.statics.ListForSite = function(site, callback) {

  var Document = this;

  Document.find({
    site: site
  }, (err, docs) => {
    if (err) return callback(err);
    callback(null, null, {
      docs: docs
    });
  });
};

Model.statics.CustomerListForSite = function(page, pageSize, filter, keyword, site, callback) {

  var Document = this;

  var query = {};
  query.$and = [{
    site: site,
    joinStyle: {
      $ne: '비공개'
    }
  }];

  var searchQuery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '총판명') {
      searchQuery['name'] = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '총판장') {
      searchQuery['manager.nick'] = {
        $regex: '.*' + keyword + '.*'
      };
    }
  }

  query.$and.push(searchQuery);

  Document.find(query)
    .select('-manager.uid')
    .exec((err, docs) => {
      if (err) return callback(err);
      callback(null, null, {
        docs: docs
      });
    });
};

Model.statics.OneName = function(site, name, callback) {

  var Document = this;

  Document.findOne({
      site: site,
      name: name
    })
    .select('-manager.uid')
    .populate({
      path: 'awaiter',
      select: 'nick level state chip'
    })
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'not-found');
      callback(null, null, doc);
    });
};

Model.statics.One = function(id, callback) {

  var Document = this;

  Document.findOne({
      _id: id
    })
    .select('-manager.uid')
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'not-found');
      callback(null, null, doc);
    });
};

Model.statics.AddJoinAwaiter = function(id, uid, callback) {

  var Document = this;

  Document.findOneAndUpdate({
      _id: id
    }, {
      $addToSet: {
        awaiter: uid
      }
    })
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
};

Model.statics.RemoveJoinAwaiter = function(id, uid, callback) {

  var Document = this;

  Document.findOneAndUpdate({
      _id: id
    }, {
      $pull: {
        awaiter: uid
      }
    })
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
};

Model.statics.RemoveJoinAwaiterAll = function(id, callback) {

  var Document = this;

  Document.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        awaiter: []
      }
    })
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
};

Model.statics.ModifyManager = function(
  id,
  uid,
  nick,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        'manager.uid': uid,
        'manager.nick': nick
      }
    })
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Distributor', Model);
};
