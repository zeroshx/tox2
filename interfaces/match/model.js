var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  home: {
    name: {
      type: String,
      index: true
    },
    score: {
      type: Number
    },
    rate: {
      type: String
    },
    bet: {
      type: Number
    },
    count: {
      type: Number
    }
  },
  tie: {
    rate: {
      type: String
    },
    bet: {
      type: Number
    },
    count: {
      type: Number
    }
  },
  away: {
    name: {
      type: String,
      index: true
    },
    score: {
      type: Number
    },
    rate: {
      type: String
    },
    bet: {
      type: Number
    },
    count: {
      type: Number
    }
  },
  variety: {
    subject: {
      type: String
    },
    option: [{
      name: {
        type: String
      },
      pick: {
        type: String
      },
      rate: {
        type: String
      },
      bet: {
        type: Number
      },
      count: {
        type: Number
      }
    }]
  },
  offset: {
    type: String
  },
  state: {
    type: String,
    index: true
  },
  btype: { // betting type
    type: String,
    index: true
  },
  mtype: { // match type
    type: String,
    index: true
  },
  group: {
    type: Schema.Types.ObjectId
  },
  kind: {
    type: String,
    index: true
  },
  league: {
    type: String,
    index: true
  },
  schedule: {
    type: String
  },
  result: {
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
Match Model's Statics Begin.
******************************************************************/
Model.statics.List = function(
  page,
  pageSize,
  filter,
  keyword,
  listMode,
  state,
  mtype,
  kind,
  league,
  result,
  callback
) {

  var Document = this;

  var query = {};
  if (listMode === 'WAY') {
    query.$and = [{
      $or: [{
        btype: '2-WAY'
      }, {
        btype: '3-WAY'
      }]
    }];
  } else if (listMode === '2-WAY'){
    query.$and = [{
      btype: '2-WAY'
    }];
  } else if (listMode === '3-WAY') {
    query.$and = [{
      btype: '3-WAY'
    }];
  } else {
    query.$and = [{
      btype: 'VARIETY'
    }];
  }

  if (mtype !== '전체') {
    query.$and.push({
      mtype: mtype
    });
  }

  if (state !== '전체') {
    query.$and.push({
      state: state
    });
  }

  if (kind !== '전체') {
    query.$and.push({
      kind: kind
    });
  }

  if (league !== '전체') {
    query.$and.push({
      league: league
    });
  }

  if (result !== '전체') {
    query.$and.push({
      result: result
    });
  }


  var subquery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '홈팀') {
      subquery = {
        'home.name': {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '원정팀') {
      subquery = {
        'away.name': {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '매치주제') {
      subquery = {
        'variety.subject': {
          $regex: '.*' + keyword + '.*'
        }
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
  homeName, homeScore, homeRate,
  tieRate,
  awayName, awayScore, awayRate,
  varietySubject, varietyOption,
  offset,
  state, btype, mtype,
  kind, league, group,
  schedule,
  callback
) {

  var Document = this;
  var timer = new Date();
  var newDoc = new Document();

  newDoc.home.name = homeName;
  newDoc.home.score = homeScore;
  newDoc.home.rate = homeRate;
  newDoc.tie.rate = tieRate;
  newDoc.away.name = awayName;
  newDoc.away.score = awayScore;
  newDoc.away.rate = awayRate;
  newDoc.variety.subject = varietySubject;
  newDoc.variety.option = varietyOption;
  newDoc.offset = offset;
  newDoc.state = state;
  newDoc.btype = btype;
  newDoc.mtype = mtype;
  newDoc.kind = kind;
  newDoc.league = league;
  newDoc.group = group;
  newDoc.schedule = schedule;

  if (btype === '2-WAY') {
    newDoc.home.bet = 0;
    newDoc.home.count = 0;
    newDoc.away.bet = 0;
    newDoc.away.count = 0;
  } else if (btype === '3-WAY') {
    newDoc.home.bet = 0;
    newDoc.home.count = 0;
    newDoc.away.bet = 0;
    newDoc.away.count = 0;
    newDoc.tie.bet = 0;
    newDoc.tie.count = 0;
  } else {
    for (var i = 0; i < newDoc.variety.option.length; i++) {
      newDoc.variety.option[i].bet = 0;
      newDoc.variety.option[i].count = 0;
    }
  }
  newDoc.createdAt = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString();
  newDoc.modifiedAt = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString();
  newDoc.save((err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};

Model.statics.Update = function(
  id,
  homeName, homeScore, homeRate,
  tieRate,
  awayName, awayScore, awayRate,
  varietySubject, varietyOption,
  offset,
  state, btype, mtype,
  kind, league, group,
  schedule,
  callback
) {

  var Document = this;
  var timer = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      home: {
        name: homeName,
        score: homeScore,
        rate: homeRate
      },
      tie: {
        rate: tieRate
      },
      away: {
        name: awayName,
        score: awayScore,
        rate: awayRate
      },
      variety: {
        subject: varietySubject,
        option: varietyOption
      },
      offset: offset,
      state: state,
      btype: btype,
      mtype: mtype,
      kind: kind,
      league: league,
      group: group,
      schedule: schedule,
      modifiedAt: timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
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
