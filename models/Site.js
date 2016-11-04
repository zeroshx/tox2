var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
    state: {
        type: String,
        enum: [
            '정상',
            '점검',
            '정지'
        ],
        required: [true, '사이트 상태가 없습니다.']
    },
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
        }
    },
    headcount: {
        type: Number,
        min: 0,
        required: [true, '액션명이 없습니다.']
    },
    answer: [{
        action: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^[가-힣a-zA-Z0-9]{2,10}$/.test(v);
                },
                message: '{VALUE}는 적절한 액션명 아닙니다.'
            },
            required: [true, '액션명이 없습니다.']
        },
        subject: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^[가-힣a-zA-Z0-9`~!@#$%^&*()-_=+|{}:;'"<>,./?\\\[\] ]{2,50}$/.test(v);
                },
                message: '{VALUE}는 적절한 답변 제목이 아닙니다.'
            },
            required: [true, '답변 제목이 없습니다.']
        },
        content: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^[가-힣a-zA-Z0-9`~!@#$%^&*()-_=+|{}:;'"<>,./?\\\[\] ]{2,1000}$/.test(v);
                },
                message: '{VALUE}는 적절한 답변 내용이 아닙니다.'
            },
            required: [true, '답변 내용이 없습니다.']
        }
    }],
    memo: {
        type: String,
        maxlength: 100
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

    if(isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
        return callback(null, '비정상적인 접근입니다.');
    }

    var query = {};
    if (typeof(keyword) === 'string' && keyword.length > 0) {
        if (filter === '사이트') {
            query.name = {
                $regex: '.*' + keyword + '.*'
            };
        } else if (filter === '메모') {
            query.memo = {
                $regex: '.*' + keyword + '.*'
            };
        } else if (filter === '사이트+메모') {
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
            if (typeof(keyword) === 'string' && keyword.length > 0) {
                return callback(null, '검색 결과가 없습니다.');
            } else {
                return callback(null, '아무 데이터도 존재하지 않습니다.');
            }
        }
    });
};

Model.statics.ListAll = function(callback) {

    var Document = this;

    Document.find(function(err, docs) {
        if (err) {
            return callback(err);
        }
        if(!docs) {
            callback(null, '존재하지 않습니다.');
        }
        return callback(null, null, {
            docs:docs
        });
    });
};

Model.statics.Create = function(
    state,
    name,
    bonusWin,
    bonusLose,
    answer,
    memo,
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
        newDoc.state = state;
        newDoc.name = name;
        newDoc.bonus = {
            win: bonusWin,
            lose: bonusLose
        };
        newDoc.answer = answer;
        newDoc.headcount = 0;
        newDoc.memo = memo;
        var moment = new Date();
        newDoc.createdAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
        newDoc.modifiedAt = moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString();
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
    state,
    name,
    bonusWin,
    bonusLose,
    answer,
    memo,
    callback
) {

    var Document = this;
    var moment = new Date();

    Document.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            state: state,
            name: name,
            bonus: {
                win: bonusWin,
                lose: bonusLose
            },
            answer: answer,
            memo: memo,
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

Model.statics.GetSiteWithName = function(name, callback) {

    var Document = this;

    Document.findOne({
        name: name
    }, function(err, doc) {
        if (err) {
            return callback(err);
        }
        if(!doc) {
            callback(null, '데이터가 존재하지 않습니다.');
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
