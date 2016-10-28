var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
    name: {
        type: String,
        unique: true,
        index: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9]{2,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 총판명이 아닙니다.'
        },
        required: [true, '총판 이름이 없습니다.']
    },
    manager: {
        nick: {
            type: String,
            index: true
        },
        detail: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    bonus: {
        win: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        lose: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    headcount: {
        type: Number,
        min: 0,
        default: 0
    },
    memo: {
        type: String,
        maxlength: 100,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/

// SiteSchema.statics.Single = function(id, callback) {
//     this.findOne({
//         _id: id
//     }, function(err, site) {
//         if (err) {
//             return callback(err);
//         }
//         if (site) {
//             return callback(null, null, site);
//         } else {
//             return callback(null, '존재하지 않는 사이트입니다.');
//         }
//     });
// };

Model.statics.List = function(page, pageSize, filter, keyword, callback) {

    var Document = this;

    if (typeof(page) !== 'string' || typeof(pageSize) !== 'string') {
        return callback(null, '비정상적인 접근입니다.');
    }
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    var query = {};
    if (typeof(keyword) === 'string' && keyword.length > 0) {
        if (filter === 'manager') {
            query.manager = {
                nick: {
                    $regex: '.*' + keyword + '.*'
                }
            };
        } else if (filter === 'name') {
            query.name = {
                $regex: '.*' + keyword + '.*'
            };
        } else if (filter === 'memo') {
            query.memo = {
                $regex: '.*' + keyword + '.*'
            };
        } else if (filter === 'name+memo') {
            query.$or = [{
                name: {
                    $regex: '.*' + keyword + '.*'
                }
            }, {
                memo: {
                    $regex: '.*' + keyword + '.*'
                }
            }];
        }
    }
    Document.count(query, function(err, count) {
            if (err) {
                return callback(err);
            }
            if (count !== 0) {
                Document.find(query)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
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
    managerId,
    managerNick,
    name,
    memo,
    bonusWin,
    bonusLose,
    callback
) {

    var Document = this;

    Document.findOne({
        name: name
    }, function(err, doc) {
        if (err) {
            return callback(err);
        }
        if (doc) {
            return callback(null, '이미 존재합니다.');
        }
        var newDoc = new Document();
        newDoc.name = name;
        newDoc.memo = memo;
        newDoc.manager = {
            detail: managerId,
            nick: managerNick
        };
        newDoc.bonus = {
            win: bonusWin,
            lose: bonusLose
        };
        newDoc.save(function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, null, newDoc);
        });
    });
};

Model.statics.Update = function(
    managerId,
    managerNick,
    id,
    name,
    memo,
    bonusWin,
    bonusLose,
    callback
) {

    var Document = this;

    Document.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            name: name,
            memo: memo,
            manager: {
                nick: managerNick,
                detail: managerId
            },
            bonus: {
                win: bonusWin,
                lose: bonusLose
            },
            modifiedAt: Date.now()
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
    mongoose.model('Distributor', Model);
};
