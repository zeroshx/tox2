var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  state: {
    type: String
  },
  name: {
    type: String,
    index: true,
    unique: true
  },
  config: {
    level: {
      type: String
    },
    cash: {
      type: Number
    },
    chip: {
      type: Number
    },
    point: {
      type: Number
    }
  },
  bonus: {
    win: {
      type: Number
    },
    lose: {
      type: Number
    },
    firstDeposit: {
      type: Number
    },
    deposit: {
      type: Number
    }
  },
  headcount: {
    type: Number
  },
  answer: [{
    action: {
      type: String
    },
    title: {
      type: String
    },
    content: {
      type: String
    }
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
Model.statics.List = function(page, pageSize, filter, keyword, callback) {
  var Document = this;

  var query = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '사이트') {
      query.name = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '메모') {
      query.memo = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '사이트+메모') {
      query.$or = [{
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

  Document.count(query, (err, count) => {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      lastPage: 1,
      docs: []
    });
    Document.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort('name')
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
  Document.find({})
    .select('name')
    .exec((err, docs) => {
      if (err) return callback(err);
      callback(null, null, docs);
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

    newDoc.state = item.state;
    newDoc.name = item.name;
    newDoc.memo = item.memo;
    newDoc.config = item.config;
    newDoc.bonus = item.bonus;
    newDoc.answer = item.answer;
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
      state: item.state,
      config: item.config,
      bonus: item.bonus,
      answer: item.answer,
      memo: item.memo
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

Model.statics.OneName = function(name, callback) {

  var Document = this;

  Document.findOne({
    name: name
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    callback(null, null, doc);
  });
};

Model.statics.ModifyHeadcount = function(name, value, callback) {

  var Document = this;

  Document.findOneAndUpdate({
    name: name
  }, {
    $inc: {
      headcount: value
    }
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
  mongoose.model('Site', Model);
};
