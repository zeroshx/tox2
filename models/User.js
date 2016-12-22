var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var Model = new Schema({
  uid: {
    type: String,
    unique: true,
    index: true
  },
  nick: {
    type: String,
    unique: true,
    index: true
  },
  password: {
    type: String
  },
  phone: {
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
  },
  debt: {
    type: Number
  },
  site: {
    type: String,
    index: true
  },
  distributor: {
    type: String,
    index: true
  },
  level: {
    type: String,
    index: true
  },
  state: {
    type: String,
    index: true
  },
  memo: [{
    content: {
      type: String
    },
    date: {
      type: String
    }
  }],
  account: {
    holder: {
      type: String
    },
    bank: {
      type: String
    },
    number: {
      type: String
    },
    pin: {
      type: String
    }
  },
  stat: {
    deposit: {
      type: Number
    },
    withdrawal: {
      type: Number
    }
  },
  login: {
    domain: {
      type: String
    },
    ip: {
      type: String
    },
    date: {
      type: String
    }
  },
  signup: {
    domain: {
      type: String
    },
    ip: {
      type: String
    },
    date: {
      type: String
    }
  },
  recommander: {
    type: String
  },
  modifiedAt: {
    type: String
  }
});

/******************************************************************
User Model's Statics Begin.
******************************************************************/
Model.statics.GenerateHash = function(password) {
  return password;
};

Model.statics.List = function(
  page,
  pageSize,
  filter,
  keyword,
  site,
  distributor,
  state,
  level,
  callback
) {

  var Document = this;

  page = parseInt(page);
  pageSize = parseInt(pageSize);

  if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
    return callback(null, '비정상적인 접근입니다.');
  }

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

  if (level !== '전체') {
    query.$and.push({
      level: level
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
    } else if (filter === '예금주') {
      subquery = {
        account: {
          holder: {
            $regex: '.*' + keyword + '.*'
          }
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
    if (err) {
      return callback(err);
    }
    if (count !== 0) {
      Document.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort('signup.date')
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

// signup
Model.statics.Create = function(
  uid,
  nick,
  password,
  phone,
  cash,
  money,
  point,
  debt,
  level,
  state,
  site,
  distributor,
  memo,
  accountHolder,
  accountBank,
  accountNumber,
  accountPin,
  recommander,
  domain,
  ip,
  callback
) {

  var Document = this;

  Document.findOne({
    $or: [{
      uid: uid
    }, {
      nick: nick
    }]
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (doc) {
      if (doc.uid == uid) {
        return callback(null, {
          element: 'uid',
          msg: '이미 존재하는 아이디 입니다.'
        });
      } else if (doc.nick == nick) {
        return callback(null, {
          element: 'nick',
          msg: '이미 존재하는 닉네임 입니다.'
        });
      } else {
        return callback(null, {
          msg: '이미 존재하는 회원입니다.'
        });
      }
    } else {
      var moment = new Date();
      var datetime = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();

      var newDoc = new Document();
      newDoc.uid = uid;
      newDoc.nick = nick;
      newDoc.password = Document.GenerateHash(password);
      newDoc.phone = phone;
      newDoc.cash = cash | 0;
      newDoc.money = money | 0;
      newDoc.point = point | 0;
      newDoc.debt = debt | 0;
      newDoc.level = level;
      newDoc.state = state;
      newDoc.site = site;
      newDoc.distributor = distributor;
      newDoc.memo = memo;
      newDoc.account = {
        holder: accountHolder,
        bank: accountBank,
        number: accountNumber,
        pin: accountPin
      };
      newDoc.recommander = recommander;
      newDoc.stat = {
        deposit: 0,
        withdrawal: 0
      };
      newDoc.signup = {
        domain: domain,
        ip: ip,
        date: datetime
      };
      newDoc.login = {
        domain: domain,
        ip: ip,
        date: datetime
      };
      newDoc.save(function(err) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, null, newDoc);
        }
      });
    }
  });
};

Model.statics.Update = function(
  id,
  password,
  phone,
  cash,
  money,
  point,
  debt,
  level,
  state,
  site,
  distributor,
  memo,
  accountHolder,
  accountBank,
  accountNumber,
  accountPin,
  recommander,
  callback
) {

  var Document = this;
  var moment = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      password: Document.GenerateHash(password),
      phone: phone,
      cash: cash | 0,
      money: money | 0,
      point: point | 0,
      debt: debt | 0,
      level: level,
      state: state,
      site: site,
      distributor: distributor,
      memo: memo,
      account: {
        holder: accountHolder,
        bank: accountBank,
        number: accountNumber,
        pin: accountPin
      },
      recommander: recommander,
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

Model.statics.Login = function(
  uid,
  password,
  domain,
  ip,
  callback
) {

  var Document = this;

  Document.findOne({
    uid: uid
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (!doc) {
      return callback(null, {
        element: 'uid',
        msg: '존재하지 않는 아이디입니다.'
      });
    }
    // hash = GenerateHash(password);
    if (doc.password == password) {
      var moment = new Date();

      doc.login.date = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
      doc.login.domain = domain;
      doc.login.ip = ip;

      doc.save(function(err, user) {
        if (err) {
          return callback(err);
        }
        return callback(null, null, user);
      });
    } else {
      return callback(null, {
        element: 'password',
        msg: '존재하지 않는 아이디거나 비밀번호가 일치하지 않습니다.'
      });
    }
  });
};
//
// Model.statics.CheckEmail = function(email, callback) {
//     this.findOne({
//         email: email
//     }, function(err, user) {
//         if (err) {
//             return callback(err);
//         }
//         if (user) {
//             return callback(null, '이미 존재하는 이메일입니다.');
//         } else {
//             return callback(null, null);
//         }
//     });
// };
//
// Model.statics.CheckNick = function(nick, callback) {
//         this.findOne({
//             nick: nick
//         }, function(err, user) {
//             if (err) {
//                 return callback(err);
//             }
//             if (user) {
//                 return callback(null, '이미 존재하는 닉네임 입니다.');
//             } else {
//                 return callback(null, null);
//             }
//         });
// };
//
Model.statics.Me = function(id, callback) {
    this.findOne({
            _id: id
        })
        .select('-password')
        .exec(function(err, user) {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback(null, '데이터가 존재하지 않습니다.');
            }
            return callback(null, null, user);
        });
};
//
// Model.statics.GetUserWithUid = function(nick, callback) {
//     this.findOne({
//         nick: nick
//     }, function(err, user) {
//         if (err) {
//             return callback(err);
//         }
//         if (!user) {
//             return callback(null, '데이터가 존재하지 않습니다.');
//         }
//         return callback(null, null, user);
//     });
// };
/******************************************************************
User Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('User', Model);
};
