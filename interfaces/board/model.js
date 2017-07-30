var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var Model = new Schema({
  uid: {
    type: String,
    index: true
  },
  nick: {
    type: String,
    index: true
  },
  level: {
    type: String
  },
  site: {
    type: String
  },
  sort: {
    type: String
  },
  form: {
    type: String
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  hit: {
    count: {
      type: Number
    },
    list: [{
      type: String
    }]
  },
  ip: {
    type: String
  },
  opinion: {
    good: {
      type: Number
    },
    bad: {
      type: Number
    },
    list: [{
      type: String
    }]
  },
  reply: [{
    type: Number,
    ref: 'Board'
  }],
  show: {
    type: Boolean
  },
  top: {
    type: Boolean
  },
  writerType: {
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
Model.statics.List = function(page, pageSize, filter, keyword, site, form, callback) {

  var Document = this;

  var query = {};
  if (site === '전체') {
    query.$and = [];
  } else {
    query.$and = [{
      site: site
    }];
  }

  if (form !== '전체') {
    query.$and.push({
      form: form
    });
  }

  var subquery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
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

  Document.count(query, (err, count) => {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      lastPage: 1,
      docs: []
    });
    Document.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort('-_id')
      .select('-content')
      .exec((err, docs) => {
        if (err) return callback(err);
        callback(null, null, {
          lastPage: Math.ceil(count / pageSize),
          docs: docs
        });
      });
  });
};

Model.statics.CustomerList = function(page, pageSize, filter, keyword, site, sort, form, callback) {

  var Document = this;

  var query = {};
  if (site === '전체') {
    query.$and = [];
  } else {
    query.$and = [{
      site: site
    }];
  }

  if (sort !== '전체') {
    query.$and.push({
      sort: sort
    });
  }

  if (form !== '전체') {
    query.$and.push({
      form: form
    });
  }

  query.$and.push({
    show: true
  });

  var subquery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '글쓴이') {
      subquery = {
        nick: {
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

  Document.count(query, (err, count) => {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      lastPage: 1,
      docs: []
    });
    Document.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort('-_id')
      .select('-content -ip -reply -show -site -sort -uid')
      .exec((err, docs) => {
        if (err) return callback(err);
        callback(null, null, {
          lastPage: Math.ceil(count / pageSize),
          docs: docs
        });
      });
  });
};

Model.statics.ReplyList = function(id, callback) {

  var Document = this;

  Document.find({
      _id: id
    })
    .populate('reply')
    .sort('-_id')
    .exec((err, docs) => {
      if (err) return callback(err);
      if (docs.length === 0 || docs[0].reply.length === 0) return callback(null, null, {
        docs: []
      });
      callback(null, null, {
        docs: docs[0].reply
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

  var newDoc = new Document();
  newDoc.uid = item.uid;
  newDoc.nick = item.nick;
  newDoc.level = item.level;
  newDoc.site = item.site;
  newDoc.sort = item.sort;
  newDoc.form = item.form;
  newDoc.title = item.title;
  newDoc.content = item.content;
  newDoc.show = item.show;
  newDoc.top = item.top;
  newDoc.writerType = item.writerType;
  newDoc.ip = item.ip;
  newDoc.hit = {
    count: 0,
    list: []
  };
  newDoc.opinion = {
    good: 0,
    bad: 0,
    list: []
  };

  newDoc.save((err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
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
      nick: item.nick,
      level: item.level,
      site: item.site,
      sort: item.sort,
      title: item.title,
      content: item.content,
      show: item.show,
      top: item.top,
      writerType: item.writerType,
      ip: item.ip
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ModifyShow = function(
  id,
  show,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      show: show
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ReplyPush = function(
  id,
  reply,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $push: {
      reply: reply
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ReplyPop = function(
  id,
  reply,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $pull: {
      reply: reply
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

Model.statics.CustomerDelete = function(id, uid, callback) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id,
    uid: uid
  }, {
    show: false
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.CustomerOne = function(id, callback) {
  var Document = this;

  var excludePath = '-opinion.list -hit.list -show -ip -form -sort -uid';

  Document.findOne({
      _id: id
    })
    .select(excludePath)
    .populate({
      path: 'reply',
      select: excludePath,
      options: {
        sort: '-_id'
      },
      populate: {
        path: 'reply',
        select: excludePath,
        options: {
          sort: '-_id'
        }
      }
    })
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'not-found');
      callback(null, null, doc);
    });
};

Model.statics.ModifyHitCount = function(id, uid, callback) {

  var Document = this;

  Document.findOne({
    _id: id
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    if (doc.hit.list.indexOf(uid) !== -1) return callback(null, null, doc);
    Document.findOneAndUpdate({
      _id: id
    }, {
      $inc: {
        'hit.count': 1
      },
      $addToSet: {
        'hit.list': uid
      }
    }, (err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
  });
};

Model.statics.ModifyOpinion = function(id, uid, type, callback) {

  var Document = this;

  Document.findOne({
    _id: id
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    if (doc.opinion.list.indexOf(uid) !== -1) return callback(null, 'precessed');
    var target = {};
    if (type === 'GOOD') {
      target = {
        'opinion.good': 1
      }
    } else if (type === 'BAD') {
      target = {
        'opinion.bad': 1
      }
    }
    Document.findOneAndUpdate({
      _id: id
    }, {
      $inc: target,
      $addToSet: {
        'opinion.list': uid
      }
    }, {
      new: true
    }, (err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
  });
};

/******************************************************************
Model's Statics End.
******************************************************************/

Model.plugin(autoIncrement.plugin, 'Board');

module.exports = function() {
  mongoose.model('Board', Model);
};
