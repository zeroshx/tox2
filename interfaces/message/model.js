var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  category: {
    type: String
  },
  sender: {
    uid: {
      type: String,
      index: true
    },
    nick: {
      type: String,
      index: true
    }
  },
  receiver: {
    uid: {
      type: String
    },
    nick: {
      type: String
    },
    site: {
      type: String
    },
    distributor: {
      type: String
    }
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  confirm: {
    type: String
  },
  confirmedAt: {
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
Model.statics.List = function(page, pageSize, filter, keyword, confirm, callback) {

  var Document = this;

  var query = {};
  if (confirm === '전체') {
    query.$and = [];
  } else {
    query.$and = [{
      confirm: confirm
    }];
  }

  var subquery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '보낸이') {
      subquery = {
        'sender.uid': {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '받는이') {
      subquery = {
        'receiver.uid': {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '제목') {
      subquery = {
        title: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '내용') {
      subquery = {
        content: {
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

  Document.count(query, function(err, count) {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      lastPage: 1,
      docs: []
    });
    Document.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort('-createdAt')
      .exec(function(err, docs) {
        if (err) return callback(err);
        callback(null, null, {
          lastPage: Math.ceil(count / pageSize),
          docs: docs
        });
      });
  });
};

Model.statics.CustomerList = function(site, distributor, uid, page, pageSize, type, confirm, callback) {

  var Document = this;

  var query = {};

  if (confirm !== '전체') {
    query.$and = [{
      confirm: confirm
    }];
  } else {
    query.$and = [];
  }

  if (type === '수신') {
    query.$and.push({
      $or: [{
        'receiver.uid': uid
      }, {
        'receiver.site': site
      }, {
        'receiver.distributor': distributor
      }, {
        category: '전체'
      }]
    });
  } else {
    query.$and.push({
      'sender.uid': uid
    });
  }

  Document.count(query, function(err, count) {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      lastPage: 1,
      docs: []
    });
    Document.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort('-createdAt')
      .exec(function(err, docs) {
        if (err) return callback(err);
        callback(null, null, {
          lastPage: Math.ceil(count / pageSize),
          docs: docs
        });
      });
  });
};

Model.statics.One = function(id, callback) {

  var Document = this;

  Document.findOne({
    _id: id
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    callback(null, null, doc);
  });
};

Model.statics.Create = function(
  item,
  callback
) {
  var Document = this;
  var timer = new Date();
  var newDoc = new Document();

  newDoc.category = item.category;
  newDoc.sender = item.sender;
  newDoc.receiver = item.receiver;
  newDoc.title = item.title;
  newDoc.content = item.content;
  newDoc.confirm = item.confirm;
  newDoc.createdAt = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString();

  newDoc.save((err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Update = function(
  id,
  title,
  content,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      title: title,
      content: content,
      modifiedAt: timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Check = function(
  id,
  confirm,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      confirm: confirm,
      confirmedAt: timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
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

Model.statics.NewReceivedList = function(uid, confirm, callback) {

  var Document = this;

  var query = {
    'receiver.uid': uid,
    confirm: confirm
  };

  Document.count(query, (err, count) => {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      count: 0,
      list: []
    });
    Document.find(query)
      .select('-_id category sender.nick receiver.nick receiver.site receiver.distributor title content createdAt')
      .exec((err, docs) => {
        if (err) return callback(err);
        callback(null, null, {
          count: count,
          list: docs
        });
      });
  });
};

Model.statics.NewSentList = function(uid, confirm, callback) {

  var Document = this;

  var query = {
    'sender.uid': uid,
    confirm: confirm
  };

  Document.count(query, (err, count) => {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      count: 0,
      list: []
    });
    Document.find(query)
      .select('-_id category sender.nick receiver.nick receiver.site receiver.distributor title content createdAt')
      .exec((err, docs) => {
        if (err) return callback(err);
        callback(null, null, {
          count: count,
          list: docs
        });
      });
  });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Message', Model);
};
