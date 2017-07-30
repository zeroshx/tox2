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
  question: {
    title: {
      type: String
    },
    content: {
      type: String
    }
  },
  answer: {
    type: String
  },
  style: { /* 회원, 비회원 */
    type: String,
  },
  state: {
    type: String
  },
  operator: {
    type: String
  },
  operatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/
Model.statics.List = function(page, pageSize, filter, keyword, site, state, style, callback) {

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

  if (style !== '전체') {
    query.$and.push({
      style: style
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
    } else if (filter === '사이트') {
      subquery = {
        site: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '제목') {
      title = {
        nick: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '내용') {
      content = {
        nick: {
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

Model.statics.One = function(id, callback) {
  var Document = this;

  Document.findOne({
    id: id
  },(err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    callback(null, null, doc);
  });
};

Model.statics.CustomerList = function(uid, page, pageSize, state, callback) {

  var Document = this;

  var query = {};
  query.$and = [{
    uid: uid
  }];

  if(state !== '전체') {
    query.$and.push({
      state: state
    });
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
  title,
  content,
  answer,
  state,
  style,
  callback
) {
  var Document = this;
  var newDoc = new Document();

  newDoc.uid = uid;
  newDoc.nick = nick;
  newDoc.site = site;
  newDoc.question = {
    title: title,
    content: content
  };
  newDoc.answer = answer;
  newDoc.state = state;
  newDoc.style = style;

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
  title,
  content,
  answer,
  state,
  style,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      nick: nick,
      site: site,
      question: {
        title: title,
        content: content,
      },
      answer: answer,
      state: state,
      style: style
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Answer = function(
  id,
  answer,
  operator,
  state,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      answer: answer,
      state: state,
      operator: operator,
      operatedAt: timer.getTime()
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Postpone = function(
  id,
  operator,
  state,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      operator: operator,
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

Model.statics.CheckAnswer = function(id, state, callback) {

  var Document = this;

  Document.findOne({
    _id: id
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    if (doc.state === state) return callback(null, 'processed');
    callback(null, null, doc);
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
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Question', Model);
};
