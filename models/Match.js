var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema = new Schema({
  home_team: {
    type: String,
    required: [true, '홈팀 이름이 없습니다.']
  },
  memo: {
    type: String,
    maxlength: 255,
    default: 'Empty'
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

module.exports = function() {
  mongoose.model('Match', MatchSchema);
};
