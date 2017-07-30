var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  name: {
    type: String,
    index: true
  },
  site: {
    type: String
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
    if (filter === '레벨') {
      subquery.name = {
        $regex: '.*' + keyword + '.*'
      };
    } else if (filter === '사이트') {
      subquery.site = {
        $regex: '.*' + keyword + '.*'
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

Model.statics.Create = function(
  item,
  operator,
  callback
) {
  var Document = this;

  Document.findOne({
    name: item.name,
    site: item.site
  }, function(err, doc) {
    if (err) return callback(err);
    if (doc) return callback(null, 'exist');
    var newDoc = new Document();

    newDoc.name = item.name;
    newDoc.site = item.site;
    newDoc.bonus = item.bonus;
    newDoc.single = item.single;
    newDoc.multi = item.multi;
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
      bonus: item.bonus,
      single: item.single,
      multi: item.multi
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

Model.statics.ListAll = function(callback) {

  var Document = this;

  Document.aggregate({
      $group: {
        _id: '$name',
      }
    })
    .sort('_id')
    .exec((err, docs) => {
      if (err) return callback(err);
      callback(null, null, docs);
    });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('SiteLevel', Model);
};
