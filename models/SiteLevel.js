var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
    name: {
        type: String,
        index: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9]{1,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 레벨명이 아닙니다.'
        },
        required: [true, '레벨명이 없습니다.']
    },
    bonus: {
        win: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, '승리 보너스가 없습니다.']
        },
        lose: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, '패배 보너스가 없습니다.']
        },
        charge: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, '충전 보너스가 없습니다.']
        },
        recommender: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, '추천인 보너스가 없습니다.']
        }
    },
    single: {
        maxBet: {
            type: Number,
            min: 0,
            required: [true, '단일 최대 배팅금액이 없습니다.']
        },
        maxRate: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\d{1,4}(|(\.(?=\d))\d{0,2})$/.test(v);
                },
                message: '{VALUE}는 적절한 배당값이 아닙니다.'
            },
            required: [true, '단일 최대 배당이 없습니다.']
        }
    },
    multi: {
        maxBet: {
            type: Number,
            min: 0,
            required: [true, '조합 최대 배팅금액이 없습니다.']
        },
        maxRate: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\d{1,4}(|(\.(?=\d))\d{0,2})$/.test(v);
                },
                message: '{VALUE}는 적절한 배당값이 아닙니다.'
            },
            required: [true, '조합 최대 배당이 없습니다.']
        }
    },
    site: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9]{2,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 사이트명이 아닙니다.'
        },
        required: [true, '사이트 이름이 없습니다.']
    },
    createdAt: {
        type: String
    },
    modifiedAt: {
        type: String
    }
});

/******************************************************************
Model's Statics Begin.
******************************************************************/
Model.statics.List = function(page, pageSize, filter, keyword, callback) {

    var Document = this;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
        return callback(null, '비정상적인 접근입니다.');
    }

    var query = {};
    if (typeof(keyword) === 'string' && keyword.length > 0) {
        if (filter === '레벨') {
            query.name = {
                $regex: '.*' + keyword + '.*'
            };
        } else if (filter === '사이트') {
            query.site = {
                $regex: '.*' + keyword + '.*'
            };
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
    bonusWin,
    bonusLose,
    bonusCharge,
    bonusRecommender,
    singleMaxBet, singleMaxRate,
    multiMaxBet, multiMaxRate,
    site,
    callback
) {
    var Document = this;

    Document.CheckPermission(name, site, function(err, doc) {
        if (err) {
            return callback(err);
        }
        if (doc) { // true or false
            return callback(null, '이미 존재하는 레벨명입니다.(' + site + ' 기준)');
        } else {
            var newDoc = new Document();
            newDoc.name = name;
            newDoc.bonus = {
                win: bonusWin,
                lose: bonusLose,
                charge: bonusCharge,
                recommender: bonusRecommender
            };
            newDoc.single = {
                maxBet: singleMaxBet,
                maxRate: singleMaxRate
            };
            newDoc.multi = {
                maxBet: multiMaxBet,
                maxRate: multiMaxRate
            };
            newDoc.site = site;
            var moment = new Date();
            newDoc.createdAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
            newDoc.modifiedAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
            newDoc.save(function(err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, null, newDoc);
            });
        }
    });
};

Model.statics.Update = function(
    id,
    name,
    bonusWin,
    bonusLose,
    bonusCharge,
    bonusRecommender,
    singleMaxBet, singleMaxRate,
    multiMaxBet, multiMaxRate,
    site,
    callback
) {

    var Document = this;
    var moment = new Date();
    
    Document.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            name: name,
            bonus: {
                win: bonusWin,
                lose: bonusLose,
                charge: bonusCharge,
                recommender: bonusRecommender
            },
            single: {
                maxBet: singleMaxBet,
                maxRate: singleMaxRate
            },
            multi: {
                maxBet: multiMaxBet,
                maxRate: multiMaxRate
            },
            site: site,
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

Model.statics.CheckPermission = function(name, site, callback) {

    var Document = this;

    Document.findOne({
        name: name,
        site: site
    }, function(err, doc) {
        if (err) {
            return callback(err);
        }
        return callback(null, doc);
    });
};
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
    mongoose.model('SiteLevel', Model);
};
