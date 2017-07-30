var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
  room: {
    type: String
  },
  text: {
    type: String
  },
  uid: {
    type: String
  },
  nick: {
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
Model.statics.List = function(room, count, callback) {

  var Document = this;

  Document.find({room: room})
    .limit(parseInt(count))
    .sort('-createdAt')
    .exec((err, docs) => {
      if (err) return callback(err);
      callback(null, null, docs);
    });
};

Model.statics.Create = function(
  room,
  text,
  uid,
  nick,
  callback
) {

  var Document = this;

  var newDoc = new Document();

  newDoc.room = room;
  newDoc.text = text;
  newDoc.uid = uid;
  newDoc.nick = nick;

  newDoc.save((err, doc) => {
    if (err) return callback(err);
    if (!doc) return callback(null, 'failure');
    callback(null, null, doc);
  });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
  mongoose.model('Messenger', Model);
};
