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
  password: {
    type: String,
    validate: {
      validator: function(v, cb) {
        if (v.length < 8 || v.length > 30) {
          cb(false);
        } else {
          cb(true);
        }
      },
      message: '{VALUE} is not a valid password'
    },
    required: [true, 'Why no password?']
  },
  nick: {
    type: String,
    index: true,
    validate: {
      validator: function(v, cb) {
        if (v.length < 2 || v.length > 8) {
          cb(false);
        } else {
          cb(true);
        }
      },
      message: '{VALUE} is not a valid password'
    },
    required: [true, 'Why no nick?']
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

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = function() {
  mongoose.model('User', UserSchema);
}
