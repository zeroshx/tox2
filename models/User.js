var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        index: true,
        required: [true, '이메일이 입력되지 않았습니다.']
    },
    nick: {
        type: String,
        index: true,
        required: [true, '닉네임이 입력되지 않았습니다.']
    },
    password: {
        type: String,
        required: [true, '비밀번호가 입력되지 않았습니다.']
    },
    phone: {
        type: String,
        default: ''
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
        index: true,
        default: 'Bronze',
        enum: ['Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze']
    },
    state: {
        type: String,
        index: true,
        default: 'Normal',
        enum: ['Stop', 'Bad', 'Normal', 'Good', 'Excellent']
    },
    memo: {
        type: [String],
        default: ['']
    },
    account: {
        bank: {
            type: String,
            default: ''
        },
        number: {
            type: String,
            default: ''
        },
        password: {
            type: String,
            default: ''
        }
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
            type: String,
            default: ''
        },
        ip: {
            type: String,
            default: ''
        },
        date: {
            type: Date,
            default: Date.now()
        }
    },
    signup: {
        domain: {
            type: String,
            default: ''
        },
        ip: {
            type: String,
            default: ''
        },
        date: {
            type: Date,
            default: Date.now()
        }
    },
    modified_at: {
        type: Date,
        default: Date.now()
    }
});

/******************************************************************
User Model's Methods Begin.
******************************************************************/
UserSchema.methods.GenerateHash = function(password, callback) {
    return bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return callback(err);
        }
        return bcrypt.hash(password, salt, null, function(err, hash) {
            if (err) {
                return callback(err);
            }
            return callback(null, hash);
        });
    });
};

// checking if password is valid
UserSchema.methods.ValidatePassword = function(password, callback) {
    return bcrypt.compare(password, this.password, function(err, match) {
        if (err) {
            return callback(err);
        }
        return callback(null, match);
    });
};
/******************************************************************
User Model's Methods End.
******************************************************************/

/******************************************************************
User Model's Statics Begin.
******************************************************************/
UserSchema.statics.validateEmail = function(email) {
    return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email);
};

UserSchema.statics.validateNick = function(nick) {
    return /^[가-힣a-zA-Z0-9]{2,8}$/g.test(nick);
};

UserSchema.statics.validatePassword = function(password) {
    return /^[0-9a-zA-Z<>,\/?:;'"\\{}\[\]()`~@#$%^&+=.\-_*]{8,30}$/i.test(password);
};

// signup
UserSchema.statics.Signup = function(email, nick, password, confirm, callback) {

    var User = this;

    if (!User.validateEmail(email)) {
        return callback(null, '적절하지 않는 이메일 형식입니다.');
    }

    if (!User.validateNick(nick)) {
        return callback(null, '적절하지 않는 닉네임입니다.');
    }

    User.findOne({
        $or: [{
            email: email
        }, {
            nick: nick
        }]
    }, function(err, user) {
        if (err) {
            return callback(err);
        }
        if (user) {
            if (user.email == email) {
                return callback(null, '이미 존재하는 이메일 입니다.');
            } else if (user.nick == nick) {
                return callback(null, '이미 존재하는 닉네임 입니다.');
            } else {
                return callback(null, '이미 존재하는 회원입니다.');
            }
        } else {
            var newUser = new User();
            newUser.email = email;
            newUser.nick = nick;
            newUser.password = password;
            newUser.confirm = confirm;
            if (newUser.password == newUser.confirm) {
                if (User.validatePassword(newUser.password)) {
                    newUser.GenerateHash(password, function(err, hash) {
                        if (err) {
                            return callback(err);
                        }
                        newUser.password = hash;
                        newUser.save(function(err) {
                            if (err) {
                                return callback(err);
                            } else {
                                newUser.password = null;
                                return callback(null, null, newUser);
                            }
                        });
                    });
                } else {
                    return callback(null, '적절하지 않는 비밀번호네요.');
                }
            } else {
                return callback(null, '비밀번호 확인에 실패하였습니다.');
            }
        }
    });
};

UserSchema.statics.Login = function(email, password, callback) {

    var User = this;

    if (!User.validateEmail(email)) {
        return callback(null, '적절하지 않는 이메일 형식입니다.');
    }

    if (!User.validatePassword(password)) {
        return callback(null, '비밀번호는 숫자, 영문자, 특수문자를 포함 8자 이상 30자 이내 입니다.');
    }

    User.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            return callback(err);
        }
        if (!user) {
            return callback(null, '존재하지 않는 이메일 또는 비밀번호가 맞지 않습니다.');
        }
        user.ValidatePassword(password, function(err, match) {
            if (err) {
                return callback(err);
            }
            if (!match) {
                return callback(null, '존재하지 않는 이메일 또는 비밀번호가 맞지 않습니다.');
            }
            user.login.date = Date.now();
            user.save(function(err, user) {
                if (err) {
                    return callback(err);
                }
                user.password = null;
                return callback(null, null, user);
            });
        });
    });
};

UserSchema.statics.CheckEmail = function(email, callback) {
    if (this.validateEmail(email)) {
        this.findOne({
            email: email
        }, function(err, user) {
            if (err) {
                return callback(err);
            }
            if (user) {
                return callback(null, '이미 존재하는 이메일입니다.');
            } else {
                return callback(null, null);
            }
        });
    } else {
        return callback(null, '이메일 형식으로 작성해주세요.');
    }
};

UserSchema.statics.CheckNick = function(nick, callback) {
    if (this.validateNick(nick)) {
        this.findOne({
            nick: nick
        }, function(err, user) {
            if (err) {
                return callback(err);
            }
            if (user) {
                return callback(null, '이미 존재하는 닉네임 입니다.');
            } else {
                return callback(null, null);
            }
        });
    } else {
        return callback(null, '별명은 2~8자에 한글, 영문, 숫자만 가능합니다.');
    }
};

UserSchema.statics.Me = function(id, callback) {
    this.findOne({
            _id: id
        })
        .populate('site distributor')
        .select('-password')
        .exec(function(err, user) {
            if (err) {
                nodemailer('controllers/auth.js:me', JSON.stringify(err));
                return callback(err);
            }
            return callback(null, null, user);
        });
};
/******************************************************************
User Model's Statics End.
******************************************************************/

module.exports = function() {
    mongoose.model('User', UserSchema);
};
