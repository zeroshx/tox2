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
  email: {
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
  },
  debt: {
    type: Number
  },
  site: {
    type: String,
    index: true
  },
  distributor: {
    name: {
      type: String,
      index: true
    },
    rank: {
      type: String
    },
    contribution: {
      type: Number
    },
    joinDate: {
      type: Date
    },
    dropOutDate: {
      type: Date
    }
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
      type: Date
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
      type: Date,
      default: Date.now
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
      type: Date,
      default: Date.now
    }
  },
  recommander: {
    type: String
  }
});

/******************************************************************
inner function
******************************************************************/
GenerateHash = function(password) {
  return password;
};

/******************************************************************
User Model's Statics Begin.
******************************************************************/
Model.statics.List = function(
  page,
  pageSize,
  filter,
  keyword,
  site,
  distributor,
  level,
  state,
  callback
) {

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

  if (level !== '전체') {
    query.$and.push({
      level: level
    });
  }

  if (state !== '전체') {
    query.$and.push({
      state: state
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

  Document.count(query, (err, count) => {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      lastPage: 1,
      docs: []
    });
    Document.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort('-signup.date')
      .exec((err, docs) => {
        if (err) return callback(err);
        callback(null, null, {
          lastPage: Math.ceil(count / pageSize),
          docs: docs
        });
      });
  });
};


Model.statics.AllMember = function(
  callback
) {
  var Document = this;
  Document.find({})
  .lean()
  .exec((err, docs) => {
    if (err) return callback(err);
    callback(null, null, docs);
  });
};

Model.statics.DistributorMember = function(
  page,
  pageSize,
  distributorName,
  callback
) {

  var Document = this;

  Document.count({
    'distributor.name': distributorName
  }, (err, count) => {
    if (err) return callback(err);
    if (count === 0) return callback(null, null, {
      total: 0,
      totalPage: 1,
      docs: []
    });
    Document.find({
        'distributor.name': distributorName
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('nick distributor chip')
      .sort('distributor.joinDate')
      .exec((err, docs) => {
        if (err) return callback(err);
        callback(null, null, {
          total: count,
          totalPage: Math.ceil(count / pageSize),
          docs: docs
        });
      });
  });
};

// signup
Model.statics.Create = function(
  item,
  callback
) {

  var Document = this;

  Document.findOne({
    $or: [{
      uid: item.uid
    }, {
      nick: item.nick
    }]
  }, function(err, doc) {
    if (err) return callback(err);
    if (doc) {
      if (doc.uid === item.uid) return callback(null, 'exist-uid');
      if (doc.nick === item.nick) return callback(null, 'exist-nick');
    }
    var newDoc = new Document();

    newDoc.uid = item.uid;
    newDoc.nick = item.nick;
    newDoc.password = GenerateHash(item.password);
    newDoc.phone = item.phone;
    newDoc.email = item.email;
    newDoc.level = item.level;
    newDoc.state = item.state;
    newDoc.site = item.site;
    newDoc.account = {
      holder: item.account.holder,
      bank: item.account.bank,
      number: item.account.number,
      pin: item.account.pin
    };
    newDoc.recommander = item.recommander;
    newDoc.signup = {
      domain: item.domain,
      ip: item.ip
    };
    newDoc.login = {
      domain: item.domain,
      ip: item.ip
    };

    newDoc.cash = 0;
    newDoc.chip = 0;
    newDoc.point = 0;
    newDoc.debt = 0;
    newDoc.distributor = {
      name: null,
      rank: null,
      contribution: null,
      joinDate: null,
      dropOutDate: null
    };
    newDoc.stat = {
      deposit: 0,
      withdrawal: 0
    };
    newDoc.memo = [];
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
      nick: item.nick,
      password: GenerateHash(item.password),
      phone: item.phone,
      email: item.email,
      level: item.level,
      state: item.state,
      site: item.site,
      account: {
        holder: item.account.holder,
        bank: item.account.bank,
        number: item.account.number,
        pin: item.account.pin
      },
      recommander: item.recommander
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

Model.statics.Signup = function(
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
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    var newDoc = new Document();

    newDoc.uid = uid;
    newDoc.password = GenerateHash(password);
    newDoc.distributor = {
      name: null,
      rank: null,
      contribution: null,
      joinDate: null,
      dropOutDate: null
    };
    newDoc.account = {
      holder: null,
      bank: null,
      number: null,
      pin: null
    };
    newDoc.stat = {
      deposit: 0,
      withdrawal: 0
    };
    newDoc.signup = {
      domain: domain,
      ip: ip
    };
    newDoc.login = {
      domain: domain,
      ip: ip
    };

    newDoc.save((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'failure');
      callback(null, null, doc);
    });
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
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'not-found');
    // hash = GenerateHash(password);
    if (doc.password == password) {
      var timer = new Date();
      doc.login.date = timer.getTime();
      doc.login.domain = domain;
      doc.login.ip = ip;
      doc.save((err, doc) => {
        if (err) return callback(err);
        if (!doc) return callback(null, 'failure');
        callback(null, null, doc);
      });
    } else {
      return callback(null, 'wrong-password');
    }
  });
};

Model.statics.CheckBasicSetting = function(id, callback) {
  this.findOne({
      _id: id
    })
    .select('-password')
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'not-found');
      if (!doc.nick || !doc.site || !doc.level || !doc.state) return callback(null, null, null);
      callback(null, null, doc);
    });
};

Model.statics.Me = function(id, callback) {
  this.findOne({
      _id: id
    })
    .select('uid nick state level site distributor cash chip point debt')
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'not-found');
      callback(null, null, doc);
    });
};

Model.statics.One = function(id, callback) {
  this.findOne({
      _id: id
    })
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'not-found');
      callback(null, null, doc);
    });
};

Model.statics.OneUid = function(uid, callback) {
  this.findOne({
      uid: uid
    })
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'not-found');
      callback(null, null, doc);
    });
};

Model.statics.OneNick = function(nick, callback) {
  this.findOne({
      nick: nick
    })
    .exec((err, doc) => {
      if (err) return callback(err);
      if (!doc) return callback(null, 'not-found');
      callback(null, null, doc);
    });
};

Model.statics.CheckNick = function(nick, callback) {
  this.findOne({
    nick: nick
  }).exec((err, doc) => {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    callback(null, null, doc);
  });
};

Model.statics.UpdateBasicSetting = function(
  id,
  nick,
  phone,
  email,
  cash,
  chip,
  point,
  debt,
  level,
  state,
  site,
  recommander,
  callback
) {

  var Document = this;

  Document.findOne({
    nick: nick
  }, (err, doc) => {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    Document.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        nick: nick,
        phone: phone,
        email: email,
        cash: cash,
        chip: chip,
        point: point,
        debt: debt,
        level: level,
        state: state,
        site: site,
        recommander: recommander
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

Model.statics.ModifyMoney = function(
  id,
  cash,
  chip,
  point,
  debt,
  callback
) {

  if (isNaN(cash) | isNaN(chip) | isNaN(point) | isNaN(debt)) {
    return callback(null, 'not-number');
  }

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $inc: {
      cash: cash,
      chip: chip,
      point: point,
      debt: debt
    }
  }, {
    new: true
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ModifyStat = function(
  id,
  deposit,
  withdrawal,
  callback
) {

  if (isNaN(deposit) | isNaN(withdrawal)) {
    return callback(null, 'not-number');
  }

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $inc: {
      'stat.deposit': deposit,
      'stat.withdrawal': withdrawal
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.JoinDistributor = function(
  id,
  distributorName,
  distributorRank,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      distributor: {
        name: distributorName,
        rank: distributorRank,
        contribution: 0,
        dropOutDate: null,
        joinDate: timer.getTime()
      }
    }
  }, {
    new: true
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ModifyDistributor = function(
  id,
  distributorRank,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      'distributor.rank': distributorRank
    }
  }, {
    new: true
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.DropOutDistributor = function(
  id,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      distributor: {
        name: null,
        rank: null,
        contribution: null,
        joinDate: null,
        dropOutDate: timer.getTime()
      }
    }
  }, {
    new: true
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.AddMemo = function(
  id,
  content,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $push: {
      memo: {
        content: content,
        date: timer.getTime()
      }
    }
  }, {
    new: true
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.RemoveMemo = function(
  id,
  mid,
  callback
) {
  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $pull: {
      memo: {
        _id: mid
      }
    }
  }, {
    new: true
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

/******************************************************************
User Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('User', Model);
};
