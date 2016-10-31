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
    site: {
        type: String,
        index: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9]{2,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 사이트 이름이 아닙니다.'
        }
    },
    manager: {
        type: String,
        index: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9]{2,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 관리자 이름이 아닙니다.'
        }
    },
    bonus: {
        win: {
            type: Number,
            min: 0,
            max: 100
        },
        lose: {
            type: Number,
            min: 0,
            max: 100
        }
    },
    memo: {
        type: String,
        maxlength: 100
    },
    headcount: {
        type: Number,
        min: 0,
        default: 0
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
Model.statics.List = function(page, pageSize, filter, keyword, callback) {

    var Document = this;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if(isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
        return callback(null, '비정상적인 접근입니다.');
    }

    var query = {};
    if (typeof(keyword) === 'string' && keyword.length > 0) {
        if (filter === 'manager') {
            query.manager = {
                $regex: '.*' + keyword + '.*'
            };
        } else if (filter === 'site') {
            query.site = {
                $regex: '.*' + keyword + '.*'
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
    name,
    site,
    manager,
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
        newDoc.site = site;
        newDoc.manager = manager;
        newDoc.bonus = {
            win: bonusWin|0,
            lose: bonusLose|0
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
    id,
    name,
    site,
    manager,
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
            site: site,
            manager: manager,
            memo: memo,
            bonus: {
                win: bonusWin|0,
                lose: bonusLose|0
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
