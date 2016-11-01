var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
    home: {
        name: {
            type: String,
            index: true,
            validate: {
                validator: function(v) {
                    return /^[가-힣a-zA-Z0-9\-\(\)'"`\[\]\? ]{0,30}$/.test(v);
                },
                message: '{VALUE}는 적절한 홈팀명이 아닙니다.'
            }
        },
        score: {
            type: Number,
            min: 0
        },
        rate: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\d{1,2}(|(\.(?=\d))\d{0,2})$/.test(v);
                },
                message: '{VALUE}는 적절한 배당값이 아닙니다.'
            }
        },
        bet: {
            type: Number,
            min: 0,
            default: 0
        },
        count: {
            type: Number,
            min: 0,
            default: 0
        }
    },
    tie: {
        rate: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\d{1,2}(|(\.(?=\d))\d{0,2})$/.test(v);
                },
                message: '{VALUE}는 적절한 배당값이 아닙니다.'
            }
        },
        bet: {
            type: Number,
            min: 0,
            default: 0
        },
        count: {
            type: Number,
            min: 0,
            default: 0
        }
    },
    away: {
        name: {
            type: String,
            index: true,
            validate: {
                validator: function(v) {
                    return /^[가-힣a-zA-Z0-9\-\(\)'"`\[\]\? ]{0,30}$/.test(v);
                },
                message: '{VALUE}는 적절한 원정팀명이 아닙니다.'
            }
        },
        score: {
            type: Number,
            min: 0
        },
        rate: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\d{1,2}(|(\.(?=\d))\d{0,2})$/.test(v);
                },
                message: '{VALUE}는 적절한 배당값이 아닙니다.'
            }
        },
        bet: {
            type: Number,
            min: 0,
            default: 0
        },
        count: {
            type: Number,
            min: 0,
            default: 0
        }
    },
    variety: {
        subject: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^[가-힣a-zA-Z0-9\-\(\)'"`\[\]\? ]{0,50}$/.test(v);
                },
                message: '{VALUE}는 적절한 버라이어티 주제가 아닙니다.'
            }
        },
        picks: [{
            name: {
                type: String,
                validate: {
                    validator: function(v) {
                        return /^[가-힣a-zA-Z0-9\-\(\)'"`\[\] ]{0,30}$/.test(v);
                    },
                    message: '{VALUE}는 적절한 픽명이 아닙니다.'
                }
            },
            pick: {
                type: String,
                enum: [
                    '선택1', '선택2', '선택3', '선택4', '선택5', '선택6', '선택7', '선택8', '선택9', '선택10',
                    '선택11', '선택12', '선택13', '선택14', '선택15', '선택16', '선택17', '선택18', '선택19', '선택20'
                ]
            },
            rate: {
                type: Number,
                min: 0
            },
            count: {
                type: Number,
                min: 0,
                default: 0
            }
        }]
    },
    offset: {
        type: String,
        validate: {
            validator: function(v) {
                return /^([-]?\d{1,2})(|(\.(?=\d))\d{0,2})$/g.test(v);
            },
            message: '{VALUE}는 적절한 기준점이 아닙니다.'
        }
    },
    state: {
        type: String,
        index: true,
        enum: ['등록', '배팅', '마감', '종료'],
        required: [true, '매치 상태가 없습니다.']
    },
    btype: { // betting type
        type: String,
        index: true,
        enum: ['2-WAY', '3-WAY', 'VARIETY'],
        required: [true, '배팅 타입이 없습니다.']
    },
    mtype: { // match type
        type: String,
        index: true,
        enum: ['일반', '핸디캡', '언더오버'],
        required: [true, '매치 타입이 없습니다']
    },
    kind: {
        type: String,
        index: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9\-\(\)'"`\[\] ]{2,16}$/.test(v);
            },
            message: '{VALUE}는 적절한 종목명 아닙니다.'
        }
    },
    league: {
        type: String,
        index: true,
        validate: {
            validator: function(v) {
                return /^[가-힣a-zA-Z0-9\-\(\)'"`\[\] ]{2,30}$/.test(v);
            },
            message: '{VALUE}는 적절한 리그명이 아닙니다.'
        }
    },
    schedule: {
        type: String,
        required: [true, '매치 일정이 없습니다.']
    },
    result: {
        type: String,
        enum: [
            '대기',
            // used in 3-way
            '홈승', '무승부', '원정승',
            // used in n-way
            '선택1', '선택2', '선택3', '선택4', '선택5', '선택6', '선택7', '선택8', '선택9', '선택10',
            '선택11', '선택12', '선택13', '선택14', '선택15', '선택16', '선택17', '선택18', '선택19', '선택20'
        ]
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
Match Model's Statics Begin.
******************************************************************/
Model.statics.List = function(
    page,
    pageSize,
    filter,
    keyword,
    listMode,
    state,
    mtype,
    kind,
    league,
    result,
    callback
) {

    var Document = this;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
        return callback(null, '비정상적인 접근입니다.');
    }

    var query = {};
    if (listMode === 'WAY') {
        query.$and = [{
            $or: [{
                btype: '2-WAY'
            }, {
                btype: '3-WAY'
            }]
        }];
    } else {
        query.$and = [{
            btype: 'VARIETY'
        }];
    }

    if (mtype !== '전체') {
        query.$and.push({
            mtype: mtype
        });
    }

    if (state !== '전체') {
        query.$and.push({
            state: state
        });
    }

    if (kind !== '전체') {
        query.$and.push({
            kind: kind
        });
    }

    if (league !== '전체') {
        query.$and.push({
            league: league
        });
    }

    if (result !== '전체') {
        query.$and.push({
            result: result
        });
    }


    var subquery = {};
    if (typeof(keyword) === 'string' && keyword.length > 0) {
        if (filter === 'home') {
            subquery = {
                'home.name': {
                    $regex: '.*' + keyword + '.*'
                }
            };
        } else if (filter === 'away') {
            subquery = {
                'away.name': {
                    $regex: '.*' + keyword + '.*'
                }
            };
        } else if (filter === 'subject') {
            subquery = {
                'variety.subject': {
                    $regex: '.*' + keyword + '.*'
                }
            };
        }
        query.$and.push(subquery);
    }

    Document.count(query, function(err, count) {
        if (err) {
            return callback(err);
        }
        if (count !== 0) {
            Document.find(query).skip((page - 1) * pageSize).limit(pageSize).sort('schedule').exec(function(err, docs) {
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
    homeName, homeScore, homeRate,
    tieRate,
    awayName, awayScore, awayRate,
    varietySubject, varietyPicks,
    offset,
    state, btype, mtype,
    kind, league,
    schedule,
    result,
    callback
) {

    var Document = this;

    if (btype === 'VARIETY') {
        homeName = '';
        homeScore = 0;
        homeRate = '0.00';
        awayName = '';
        awayScore = 0;
        awayRate = '0.00';
        tieRate = '0.00';
    } else if (btype === '2-WAY') {
        tieRate = '0.00';
        varietySubject = '';
        varietyPicks = [];
    } else { // 3-way
        varietySubject = '';
        varietyPicks = [];
    }

    if (mtype === '일반') {
        offset = '0.0';
    }

    if (state !== '종료') {
        result = '대기';
        homeScore = 0;
        awayScore = 0;
    }

    var newDoc = new Document();
    newDoc.home.name = homeName;
    newDoc.home.score = homeScore;
    newDoc.home.rate = homeRate;
    newDoc.away.name = awayName;
    newDoc.away.score = awayScore;
    newDoc.away.rate = awayRate;
    newDoc.tie.rate = tieRate;
    newDoc.variety.subject = varietySubject;
    newDoc.variety.picks = varietyPicks;
    newDoc.offset = offset;
    newDoc.state = state;
    newDoc.btype = btype;
    newDoc.mtype = mtype;
    newDoc.kind = kind;
    newDoc.league = league;
    newDoc.schedule = schedule;
    newDoc.result = result;

    newDoc.save(function(err) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, newDoc);
    });
};

Model.statics.Update = function(
    id,
    homeName, homeScore, homeRate,
    tieRate,
    awayName, awayScore, awayRate,
    varietySubject, varietyPicks,
    offset,
    state, btype, mtype,
    kind, league,
    schedule,
    result,
    callback
) {

    var Document = this;

    if (btype === 'VARIETY') {
        homeName = '';
        homeScore = 0;
        homeRate = '0.00';
        awayName = '';
        awayScore = 0;
        awayRate = '0.00';
        tieRate = '0.00';
    } else if (btype === '2-WAY') {
        tieRate = '0.00';
        varietySubject = '';
        varietyPicks = [];
    } else { // 3-way
        varietySubject = '';
        varietyPicks = [];
    }

    if (mtype === '일반') {
        offset = '0.0';
    }

    if (state !== '종료') {
        result = '대기';
        homeScore = 0;
        awayScore = 0;
    }

    Document.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            home: {
                name: homeName,
                score: homeScore,
                rate: homeRate
            },
            tie: {
                rate: tieRate
            },
            away: {
                name: awayName,
                score: awayScore,
                rate: awayRate
            },
            variety: {
                subject: varietySubject,
                picks: varietyPicks
            },
            offset: offset,
            state: state,
            btype: btype,
            mtype: mtype,
            kind: kind,
            league: league,
            schedule: schedule,
            result: result,
            modified_at: Date.now()
        }
    }, {
        runValidators: true
    }, function(err, match) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, match);
    });
};

Model.statics.Delete = function(id, callback) {

    var Document = this;

    Document.findOneAndRemove({
        _id: id
    }, function(err, match) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, match);
    });
};
/******************************************************************
Match Model's Statics End.
******************************************************************/

module.exports = function() {
    mongoose.model('Match', Model);
};
