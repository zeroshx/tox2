var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  content: [{
    status: {
      type: String
    },
    name: {
      type: String
    }
  }],
  market: [{
    name: {
      type: String
    },
    btype: {  // NORMAL, HANDICAP, UNDEROVER
      type: String
    },
    game: [{
      offset: {
        type: String
      },
      show: {
        type: Boolean
      },
      pick: [{
        name: {
          type: String
        },
        rate: {
          type: String
        },
        count: {
          type: Number
        },
        pot: {
          type: Number
        }
      }]
    }]
  }],
  mtype: {
    type: String
  },
  state: {
    type: String,
    index: true
  },
  kind: {
    type: String,
    index: true
  },
  league: {
    type: String,
    index: true
  },
  result: {
    type: String
  },
  schedule: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/******************************************************************
Match Model's Statics Begin.
******************************************************************/
Model.statics.List = function(
  page,
  pageSize,
  filter,
  keyword,
  state,
  kind,
  beginDate,
  endDate,
  callback
) {

  var Document = this;

  var query = {
    '$and': []
  };

  query.$and.push({
    schedule: {
      $gte: new Date(beginDate),
      $lte: new Date(endDate)
    }
  });

  if (state === '전체') {
    query.$and.push({
      state: {
        $ne: '종료'
      }
    });
  } else {
    query.$and.push({
      state: state
    });
  }

  if (kind !== '전체') {
    query.$and.push({
      kind: kind
    });
  }

  var subquery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '친정팀') {
      subquery = {
        'team.status': 'HOME',
        'team.name': {
          $regex: '.*' + keyword + '.*'
        },
      };
    } else if (filter === '원정팀') {
      subquery = {
        'team.status': 'AWAY',
        'team.name': {
          $regex: '.*' + keyword + '.*'
        },
      };
    } else if (filter === '리그') {
      subquery = {
        'league': {
          $regex: '.*' + keyword + '.*'
        },
      };
    }
    query.$and.push(subquery);
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
      .sort('schedule')
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
  callback
) {

  var Document = this;
  var newDoc = new Document();

  newDoc.state = item.state;
  newDoc.mtype = item.mtype;
  newDoc.kind = item.kind;
  newDoc.league = item.league;
  newDoc.schedule = item.schedule;
  newDoc.content = item.content;
  newDoc.market = item.market;
  newDoc.result = null;

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
      mtype: item.mtype,
      kind: item.kind,
      league: item.league,
      schedule: item.schedule,
      content: item.content,
      market: item.market,
    }
  }, (err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.ModifyState = function(
  id,
  state,
  callback
) {

  var Document = this;

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
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
/******************************************************************
Match Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Match', Model);
};
