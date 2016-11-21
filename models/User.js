var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
    auth: {
        type: String,
        unique: true,
        index: true,
        validate: {
            validator: function(v) {
                return /^[a-z0-9]{2,16}$/i.test(v);
            },
            message: '{VALUE}는 적절한 아이디가 아닙니다.'
        },
        required: [true, '아이디가 없습니다.']
    },
    nick: {
        type: String,
        unique: true,
        index: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9]{2,16}$/g.test(v);
            },
            message: '{VALUE}는 적절한 닉네임이 아닙니다.'
        },
        required: [true, '닉네임이 없습니다.']
    },
    password: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[ㄱ-핳0-9a-zA-Z`~!@#$%^&*()-_=+|{}:;'"<>,./?\\\[\]]{8,30}$/i.test(v);
            },
            message: '{VALUE}는 적절한 비밀번호가 아닙니다.'
        },
        required: [true, '비밀번호가 없습니다.']
    },
    phone: {
        type: String,
        maxlength: 20
    },
    cash: {
        type: Number,
        min: 0
    },
    money: {
        type: Number,
        min: 0
    },
    point: {
        type: Number,
        min: 0
    },
    site: {
        type: String,
        index: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9]{2,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 사이트 이름이 아닙니다.'
        },
        required: [true, '사이트 이름이 없습니다.']
    },
    distributor: {
        type: String,
        index: true,
        validate: {
            validator: function(v) {
                if(v==='') return true;
                return /^[가-힣a-zA-Z0-9]{2,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 총판명이 아닙니다.'
        }
    },
    level: {
        type: String,
        index: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9]{1,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 레벨명이 아닙니다.'
        },
        required: [true, '레벨이 없습니다.']
    },
    state: {
        type: String,
        index: true,
        enum: ['정지', '정상', '테스터'],
        required: [true, '회원 상태가 없습니다.']
    },
    memo: [{
        content: {
            type: String,
            maxlength: 200,
            required: [true, '메모가 없습니다.']
        },
        date: {
            type: String,
            required: [true, '작성일이 없습니다.']
        }
    }],
    account: {
        bank: {
            type: String,
            maxlength: 50
        },
        number: {
            type: String,
            maxlength: 50
        },
        pin: {
            type: String,
            validate: {
                validator: function(v) {
                    if(v==='') return true;
                    return /^[0-9]{4,8}$/.test(v);
                },
                message: '{VALUE}는 적절한 인증코드 아닙니다.'
            }
        }
    },
    stat: {
        deposit: {
            type: Number,
            min: 0
        },
        withdrawal: {
            type: Number,
            min: 0
        }
    },
    login: {
        domain: {
            type: String
        },
        ip: {
            type: String
        },
        date: {
            type: String
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
            type: String
        }
    },
    recommander: {
        type: String,
        validate: {
            validator: function(v) {
                if (v==='') return true;
                return /^[가-힣a-zA-Z0-9]{2,16}$/g.test(v);
            },
            message: '{VALUE}는 적절한 닉네임이 아닙니다.'
        }
    },
    modifiedAt: {
        type: String
    }
});

/******************************************************************
User Model's Statics Begin.
******************************************************************/
Model.statics.GenerateHash = function(password) {
    return password;
};

Model.statics.List = function(
    page,
    pageSize,
    filter,
    keyword,
    site,
    distributor,
    state,
    level,
    callback
) {

    var Document = this;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
        return callback(null, '비정상적인 접근입니다.');
    }

    var query = {};
    if (site === '전체') {
        query.$and = [];
    } else {
        query.$and = [{
            site: site
        }];
    }

    if (distributor !== '전체') {
        query.$and.push({
            distributor: distributor
        });
    }

    if (state !== '전체') {
        query.$and.push({
            state: state
        });
    }

    if (level !== '전체') {
        query.$and.push({
            level: level
        });
    }

    var subquery = {};
    if (typeof(keyword) === 'string' && keyword.length > 0) {
        if (filter === '아이디') {
            subquery = {
                auth: {
                    $regex: '.*' + keyword + '.*'
                }
            };
        } else if (filter === '닉네임') {
            subquery = {
                nick: {
                    $regex: '.*' + keyword + '.*'
                }
            };
        }
    }

    if(query.$and.length > 0) {
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
                .sort('signup.date')
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

// signup
Model.statics.Create = function(
    auth,
    nick,
    password,
    phone,
    cash,
    money,
    point,
    level,
    state,
    site,
    distributor,
    memo,
    accountBank,
    accountNumber,
    accountPin,
    domain,
    ip,
    callback
) {

    var Document = this;

    Document.findOne({
        $or: [{
            auth: auth
        }, {
            nick: nick
        }]
    }, function(err, doc) {
        if (err) {
            return callback(err);
        }
        if (doc) {
            if (doc.auth == auth) {
                return callback(null, '이미 존재하는 아이디 입니다.');
            } else if (doc.nick == nick) {
                return callback(null, '이미 존재하는 닉네임 입니다.');
            } else {
                return callback(null, '이미 존재하는 회원입니다.');
            }
        } else {
            var moment = new Date();
            var datetime = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
            var newDoc = new Document();
            newDoc.auth = auth;
            newDoc.nick = nick;
            newDoc.password = Document.GenerateHash(password);
            newDoc.phone = phone;
            newDoc.cash = cash|0;
            newDoc.money = money|0;
            newDoc.point = point|0;
            newDoc.level = level;
            newDoc.state = state;
            newDoc.site = site;
            newDoc.distributor = distributor;
            newDoc.memo = memo;
            newDoc.account = {
                bank: accountBank,
                number: accountNumber,
                pin: accountPin
            };
            newDoc.stat = {
                deposit: 0,
                withdrawal: 0
            };
            newDoc.signup.domain = domain;
            newDoc.signup.ip = ip;
            newDoc.signup.date = datetime;
            newDoc.save(function(err) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, null, true);
                }
            });
        }
    });
};

Model.statics.Update = function(
    id,
    auth,
    nick,
    password,
    phone,
    cash,
    money,
    point,
    level,
    state,
    site,
    distributor,
    memo,
    accountBank,
    accountNumber,
    accountPin,
    recommander,
    callback
) {

    var Document = this;
    var moment = new Date();

    Document.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            auth: auth,
            nick: nick,
            password: Document.GenerateHash(password),
            phone: phone,
            cash: cash,
            money: money,
            point: point,
            level: level,
            state: state,
            site: site,
            distributor: distributor,
            memo: memo,
            account: {
                bank: accountBank,
                number: accountNumber,
                pin: accountPin
            },
            recommander: recommander,
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

// Model.statics.Login = function(
//     auth,
//     password,
//     domain,
//     ip,
//     callback
// ) {
//
//     var Document = this;
//
//     Document.findOne({
//             auth: auth
//         }, function(err, doc) {
//             if (err) {
//                 return callback(err);
//             }
//             if (!doc) {
//                 return callback(null, '존재하지 않는 아이디입니다.');
//             }
//             hash = GenerateHash(password);
//             if (doc.password == hash) {
//                 var moment = new Date();
//
//                 doc.login.date = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
//                 doc.login.domain = domain;
//                 doc.login.ip = ip;
//
//                 doc.save(function(err, user) {
//                     if (err) {
//                         return callback(err);
//                     }
//                     return callback(null, null, user);
//                 });
//             } else {
//                 return callback(null, '비밀번호가 옳바르지 않습니다.');
//             }
//         });
// };
//
// Model.statics.CheckEmail = function(email, callback) {
//     this.findOne({
//         email: email
//     }, function(err, user) {
//         if (err) {
//             return callback(err);
//         }
//         if (user) {
//             return callback(null, '이미 존재하는 이메일입니다.');
//         } else {
//             return callback(null, null);
//         }
//     });
// };
//
// Model.statics.CheckNick = function(nick, callback) {
//         this.findOne({
//             nick: nick
//         }, function(err, user) {
//             if (err) {
//                 return callback(err);
//             }
//             if (user) {
//                 return callback(null, '이미 존재하는 닉네임 입니다.');
//             } else {
//                 return callback(null, null);
//             }
//         });
// };
//
// Model.statics.Me = function(id, callback) {
//     this.findOne({
//             _id: id
//         })
//         .populate('site distributor')
//         .select('-password')
//         .exec(function(err, user) {
//             if (err) {
//                 return callback(err);
//             }
//             if (!user) {
//                 return callback(null, '데이터가 존재하지 않습니다.');
//             }
//             return callback(null, null, user);
//         });
// };
//
// Model.statics.GetUserWithNick = function(nick, callback) {
//     this.findOne({
//         nick: nick
//     }, function(err, user) {
//         if (err) {
//             return callback(err);
//         }
//         if (!user) {
//             return callback(null, '데이터가 존재하지 않습니다.');
//         }
//         return callback(null, null, user);
//     });
// };
/******************************************************************
User Model's Statics End.
******************************************************************/

module.exports = function() {
    mongoose.model('User', Model);
};
