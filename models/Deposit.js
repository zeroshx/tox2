var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
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
    } else if (filter === '사이트') {
      subquery = {
        site: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '총판') {
      subquery = {
        distributor: {
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
    if (err) {
      return callback(err);
    }
    if (count !== 0) {
      Document.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort('-createdAt')
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

Model.statics.Create = function(
  nick,
  holder,
  site,
  distributor,
  cash,
  state,
  callback
) {
  var Document = this;

  Document.findOne({
    nick: nick
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (doc) {
      return callback(null, '이미 존재합니다.');
    }
    var newDoc = new Document();
    newDoc.nick = nick;
    newDoc.holder = holder;
    newDoc.site = site;
    newDoc.distributor = distributor;
    newDoc.cash = cash;
    newDoc.state = state;

    var moment = new Date();
    newDoc.createdAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
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
  site,
  distributor,
  cash,
  state,
  callback
) {

  var Document = this;
  var moment = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      site: site,
      distributor: distributor,
      cash: cash,
      state: state,
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

Model.statics.Accept = function(
  id,
  state,
  callback
) {

  var Document = this;
  var moment = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      state: state,
      operatedAt: moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString()
    }
  }, {
    runValidators: true
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (doc === null) {
      return callback(null, '승인에 실패하였습니다.');
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
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Deposit', Model);
};
