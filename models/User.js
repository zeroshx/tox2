var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    index: true,
    validate: {
      validator: function(v, cb) {
        var rule = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(v);
        if (rule) {
          cb(true);
        } else {
          cb(false);
        }
      },
      message: '{VALUE} is not a valid email address.'
    },
    required: [true, 'Why no email?']
  },
  nick: {
    type: String,
    index: true,
    validate: {
      validator: function(v, cb) {
        var rule = /^[가-힣a-zA-Z0-9]{2,8}$/g.test(v);
        if (rule) {
          cb(true);
        } else {
          cb(false);
        }
      },
      message: '{VALUE} is not a valid nick.'
    },
    required: [true, 'Why no nick?']
  },
  password: {
    type: String,
    required: [true, 'Why no password?']
  },
  phone: {
    type: String,
    default: null
  },
  money: {
    type: Number,
    default: 0
  },
  point: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    default: 'Bronze',
    enum: ['Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze']
  },
  state: {
    type: String,
    default: 'Normal',
    enum: ['Stop', 'Bad', 'Normal', 'Good', 'Excellent']
  },
  memo: {
    type: [String],
    maxlength: 100
  },
  account: {
    bank: {
      type: String
    },
    number: {
      type: String
    },
    password: {
      type: String
    }
  },
  config: {
    type: String
  },
  //TODO: POPULATION WITH NAME!
  site: {
    type: Schema.Types.ObjectId,
    ref: 'Site'
  },
  distributor: {
    type: Schema.Types.ObjectId,
    ref: 'Distributor'
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
      default: Date.now()
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
      default: Date.now()
    }
  }
});

UserSchema.methods.generateHash = function(password, callback) {
  return bcrypt.genSalt(10, function (err, salt){
    if(err) {
      return callback(err);
    }
    return bcrypt.hash(password, salt, null, function (err, hash) {
      if(err) {
        return callback(err);
      }
      return callback(null, hash);
    });
  });
};

// checking if password is valid
UserSchema.methods.validatePassword = function(password, callback) {
  return bcrypt.compare(password, this.password, function(err, match) {
    if(err) {
      return callback(err);
    }
    return callback(null, match);
  });
};

module.exports = function() {
  mongoose.model('User', UserSchema);
}
