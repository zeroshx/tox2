var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  name: {
    type: String,
    index: true
  },
  bonus: {
    win: {
      type: Number
    },
    lose: {
      type: Number
    },
    charge: {
      type: Number
    },
    recommender: {
      type: Number
    }
  },
  single: {
    maxBet: {
      type: Number
    },
    minBet: {
      type: Number
    },
    maxRate: {
      type: String
    }
  },
  multi: {
    maxBet: {
      type: Number
    },
    minBet: {
      type: Number
    },
    maxRate: {
      type: String
    }
  },
  site: {
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
    if (filter === '레벨') {
      query.name = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '사이트') {
      query.site = {
        $regex: '.*' + keyword + '.*'
      };
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
  name,
  bonusWin,
  bonusLose,
  bonusCharge,
  bonusRecommender,
  singleMaxBet, singleMinBet, singleMaxRate,
  multiMaxBet, multiMinBet, multiMaxRate,
  site,
  callback
) {
  var Document = this;

  Document.CheckPermission(name, site, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (doc) { // true or false
      return callback(null, '이미 존재하는 레벨명입니다.(' + site + ' 기준)');
    } else {
      var newDoc = new Document();
      newDoc.name = name;
      newDoc.bonus = {
        win: bonusWin,
        lose: bonusLose,
        charge: bonusCharge,
        recommender: bonusRecommender
      };
      newDoc.single = {
        maxBet: singleMaxBet,
        minBet: singleMinBet,
        maxRate: singleMaxRate
      };
      newDoc.multi = {
        maxBet: multiMaxBet,
        minBet: multiMinBet,
        maxRate: multiMaxRate
      };
      newDoc.site = site;
      var moment = new Date();
      newDoc.createdAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
      newDoc.modifiedAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
      newDoc.save(function(err) {
        if (err) {
          return callback(err);
        }
        return callback(null, null, newDoc);
      });
    }
  });
};

Model.statics.Update = function(
  id,
  bonusWin,
  bonusLose,
  bonusCharge,
  bonusRecommender,
  singleMaxBet, singleMinBet, singleMaxRate,
  multiMaxBet, multiMinBet, multiMaxRate,
  callback
) {

  var Document = this;
  var moment = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      bonus: {
        win: bonusWin,
        lose: bonusLose,
        charge: bonusCharge,
        recommender: bonusRecommender
      },
      single: {
        maxBet: singleMaxBet,
        minBet: singleMinBet,
        maxRate: singleMaxRate
      },
      multi: {
        maxBet: multiMaxBet,
        minBet: multiMinBet,
        maxRate: multiMaxRate
      },
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

Model.statics.CheckPermission = function(name, site, callback) {

  var Document = this;

  Document.findOne({
    name: name,
    site: site
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    return callback(null, doc);
  });
};

Model.statics.ListForSite = function(site, callback) {

  var Document = this;

  Document.find({
    site: site
  }, function(err, docs) {
    if (err) {
      return callback(err);
    }
    return callback(null, null, {
      docs: docs
    });
  });
};

Model.statics.ListAll = function(callback) {

  var Document = this;

  Document.aggregate({
      $group: {
        _id: '$name'
      }
    })
    .sort('_id')
    .exec(function(err, docs) {
      if (err) {
        return callback(err);
      }
      return callback(null, null, {
        docs: docs
      });
    });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('SiteLevel', Model);
};
