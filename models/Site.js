var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
    name: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9]{2,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 사이트명이 아닙니다.'
        },
        required: [true, '사이트 이름이 없습니다.']
    },
    memo: {
        type: String,
        maxlength: 100,
        default: ''
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
    created_at: {
        type: Date,
        default: Date.now()
    },
    modified_at: {
        type: Date,
        default: Date.now()
    }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/

// Model.statics.Single = function(id, callback) {
//     this.findOne({
//         _id: id
//     }, function(err, doc) {
//         if (err) {
//             return callback(err);
//         }
//         if (doc) {
//             return callback(null, null, doc);
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
        if (filter === 'name') {
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
            Document.find(query).skip((page - 1) * pageSize).limit(pageSize).exec(function(err, docs) {
                if (err) {
                    return callback(err);
                }
                return callback(null, null, {
                    count: Math.ceil(count / pageSize),
                    docs: docs
                });
            });
        } else {
            if(typeof(keyword) === 'string' && keyword.length > 0) {
                return callback(null, '검색 결과가 없습니다.');
            } else {
                return callback(null, '사이트가 없습니다.');
            }
        }
    });
};

Model.statics.Create = function(
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
            return callback(null, '이미 존재하는 사이트입니다.');
        }
        var newSite = new Document();
        newSite.name = name;
        newSite.memo = memo;
        newSite.bonus = {
            win: bonusWin,
            lose: bonusLose
        };
        newSite.save(function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, null, newSite);
        });
    });
};

Model.statics.Update = function(
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
            bonus: {
                win: bonusWin,
                lose: bonusLose
            },
            modified_at: Date.now()
        }
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
    mongoose.model('Site', Model);
};
