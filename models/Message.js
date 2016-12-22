var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  sender: {
    type: String,
    index: true
  },
  receiver: {
    type: String,
    index: true
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  check: {
    type: String
  },
  checkedAt: {
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
Model.statics.List = function(page, pageSize, filter, keyword, check, callback) {

  var Document = this;

  page = parseInt(page);
  pageSize = parseInt(pageSize);


  if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
    return callback(null, '비정상적인 접근입니다.');
  }

  var query = {};
  if (check === '전체') {
    query.$and = [];
  } else {
    query.$and = [{
      check: check
    }];
  }

  var subquery = {};
  if (typeof(keyword) === 'string' && keyword.length > 0) {
    if (filter === '보낸이') {
      subquery = {
        sender: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '받는이') {
      subquery = {
        receiver: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '제목') {
      subquery = {
        title: {
          $regex: '.*' + keyword + '.*'
        }
      };
    } else if (filter === '내용') {
      subquery = {
        content: {
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
  sender,
  receiver,
  title,
  content,
  callback
) {
  var Document = this;

  var newDoc = new Document();
  newDoc.sender = sender;
  newDoc.receiver = receiver;
  newDoc.title = title;
  newDoc.content = content;
  newDoc.check = '안읽음';

  var moment = new Date();
  newDoc.createdAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();

  newDoc.save(function(err) {
    if (err) {
      return callback(err);
    }
    return callback(null, null, newDoc);
  });
};

Model.statics.Update = function(
  id,
  title,
  content,
  callback
) {

  var Document = this;
  var moment = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      title: title,
      content: content,
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

Model.statics.Check = function(
  id,
  callback
) {

  var Document = this;
  var moment = new Date();

  Document.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      check: '읽음',
      checkedAt: moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString()
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
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Message', Model);
};
