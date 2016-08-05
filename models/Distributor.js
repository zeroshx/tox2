var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DistributorSchema = new Schema({
  name: {
    type: String,
    unique: true,
    validate: {
      validator: function(v, cb) {
        var rule = /^[가-힣a-zA-Z0-9]{2,16}$/g.test(v);
        if (rule) {
          cb(true);
        } else {
          cb(false);
        }
      },
      message: '{VALUE} is not a valid Distributor name.'
    },
    required: [true, 'Why no Distributor name?']
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
  mongoose.model('Distributor', DistributorSchema);
};
