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
    money: {
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
    subject: {
      type: String
    },
    content: {
      type: String
    }
  }],
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
Model.statics.List = function(page, pageSize, filter, keyword, callback) {
  var Document = this;

  page = parseInt(page);
  pageSize = parseInt(pageSize);

  if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
    return callback(null, '비정상적인 접근입니다.');
  }

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

  Document.count(query, function(err, count) {
    if (err) {
      return callback(err);
    }
    if (count !== 0) {
      Document.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort('name')
        .exec(function(err, docs) {
          if (err) {
            return callback(err);
          }
          return callback(null, null, {
            count: Math.ceil(count / pageSize),
            docs: docs
          });
        });
    } else {
      if (typeof(keyword) === 'string' && keyword.length > 0) {
        return callback(null, '검색 결과가 없습니다.');
      } else {
        return callback(null, '아무 데이터도 존재하지 않습니다.');
      }
    }
  });
};

Model.statics.ListAll = function(callback) {

  var Document = this;

  Document.find(function(err, docs) {
    if (err) {
      return callback(err);
    }
    if (!docs) {
      callback(null, '존재하지 않습니다.');
    }
    return callback(null, null, {
      docs: docs
    });
  });
};

Model.statics.Create = function(
  state,
  name,
  configLevel,
  configCash,
  configMoney,
  configPoint,
  bonusWin,
  bonusLose,
  bonusFirstDeposit,
  bonusDeposit,
  answer,
  memo,
  callback
) {

  var Document = this;

  Document.findOne({
    name: name
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (doc) {
      return callback(null, '이미 존재합니다.(' + name + ')');
    }
    var newDoc = new Document();
    newDoc.state = state;
    newDoc.name = name;
    newDoc.config = {
      level: configLevel,
      cash: configCash,
      money: configMoney,
      point: configPoint
    };
    newDoc.bonus = {
      win: bonusWin,
      lose: bonusLose,
      firstDeposit: bonusFirstDeposit,
      deposit: bonusDeposit
    };
    newDoc.answer = answer;
    newDoc.headcount = 0;
    newDoc.memo = memo;
    var moment = new Date();
    newDoc.createdAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
    newDoc.modifiedAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
    newDoc.save(function(err) {
      if (err) {
        return callback(err);
      }
      return callback(null, null, newDoc);
    });
  });
};

Model.statics.Update = function(
  id,
  state,
  configLevel,
  configCash,
  configMoney,
  configPoint,
  bonusWin,
  bonusLose,
  bonusFirstDeposit,
  bonusDeposit,
  answer,
  memo,
  callback
) {

  var Document = this;
  var moment = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      state: state,
      config: {
        level: configLevel,
        cash: configCash,
        money: configMoney,
        point: configPoint
      },
      bonus: {
        win: bonusWin,
        lose: bonusLose,
        firstDeposit: bonusFirstDeposit,
        deposit: bonusDeposit
      },
      answer: answer,
      memo: memo,
      modifiedAt: moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString()
    }
  }, {
    runValidators: true
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (doc === null) {
      return callback(null, '수정에 실패하였습니다.');
    }
    return callback(null, null, doc);
  });
};

Model.statics.Delete = function(id, callback) {

  var Document = this;

  Document.findOneAndRemove({
    _id: id
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    return callback(null, null, doc);
  });
};

Model.statics.ModifyHeadcount = function(name, value, callback) {

  var Document = this;
  var moment = new Date();

  Document.findOneAndUpdate({
    name: name
  }, {
    $set: {
      modifiedAt: moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString()
    },
    $inc: {
      headcount: value
    }
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (!doc) {
      return callback(null, '작업에 실패하였습니다.');
    }
    return callback(null, null, doc);
  });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Site', Model);
};
