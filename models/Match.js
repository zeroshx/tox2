var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema = new Schema({
    home: {
        name: {
            type: String,
            index: true,
            required: [true, '홈팀명이 없습니다.']
        },
        score: {
            type: Number,
            default: -1
        }
    },
    away: {
        name: {
            type: String,
            index: true,
            required: [true, '원정팀명이 없습니다.']
        },
        score: {
            type: Number,
            default: -1
        }
    },
    rate: {
        home: {
            type: Number,
            default: 0
        },
        draw: {
            type: Number,
            default: 0
        },
        away: {
            type: Number,
            default: 0
        }
    },
    state: {
        type: String,
        index: true,
        default: 'CREATE',
        enum: ['CREATE', 'OPEN', 'CLOSE', 'FINISH']
    },
    btype: { // betting type
        type: String,
        index: true,
        default: '2-WAY',
        enum: ['2-WAY', '3-WAY', 'N-WAY']
    },
    gtype: { // game type
        type: String,
        index: true,
        default: 'WDL',
        enum: ['WDL', 'HDC', 'UOV']
    },
    result: {
        type: String,
        default: 'WAIT',
        enum: [
            'WAIT',
            // used in 3-way
            'HOME', 'DRAW', 'AWAY',
            // used in 2-way
            'LEFT', 'RIGHT',
            // used in n-way
            'PICK1', 'PICK2', 'PICK3', 'PICK4', 'PICK5', 'PICK6', 'PICK7', 'PICK8', 'PICK9', 'PICK10',
            'PICK11', 'PICK12', 'PICK13', 'PICK14', 'PICK15', 'PICK16', 'PICK17', 'PICK18', 'PICK19', 'PICK20'
        ]
    },
    league: {
        type: Schema.Types.ObjectId,
        ref: 'MatchLeague',
        index: true,
        default: null
    },
    kind: {
        type: Schema.Types.ObjectId,
        ref: 'MatchKind',
        index: true,
        default: null
    },
    schedule: {
        date: {
            type: String,
            default: 'yyyy-mm-dd'
        },
        hour: {
            type: String,
            default: 0
        },
        min: {
            type: String,
            default: 0
        },
        sec: {
            type: String,
            default: 0
        }
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
Match Model's Statics Begin.
******************************************************************/
MatchSchema.statics.validateName = function(name) {
    return /^[가-힣a-zA-Z0-9()]{2,30}$/g.test(name);
};

MatchSchema.statics.validateScore = function(score) {
    return /^[0-9]{1,10}$/g.test(score);
};

MatchSchema.statics.validateRate = function(rate) {
    return /^(\d{1,2})(\.(?=\d))?\d{0,2}$/g.test(rate);
};

MatchSchema.statics.validateDate = function(date) {
    return /^\d{4}-\d{2}-\d{2}$/g.test(date);
};

MatchSchema.statics.validateTime = function(time, mode) {
    if (mode == 'hour') {
        return ('00' <= time && time < '24');
    } else {
        return ('00' <= time && time < '60');
    }
};

MatchSchema.statics.Single = function(id, callback) {
    this.findOne({
        _id: id
    }, function(err, match) {
        if (err) {
            return callback(err);
        }
        if (match) {
            return callback(null, null, match);
        } else {
            return callback(null, '존재하지 않는 경기입니다.');
        }
    });
};

MatchSchema.statics.List = function(callback) {
    this.find(function(err, matches) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, matches);
    });
};

MatchSchema.statics.Create = function(
    home_name, home_score,
    away_name, away_score,
    rate_home, rate_draw, rate_away,
    state, btype, gtype,
    league_id,
    kind_id,
    schedule_date, schedule_hour, schedule_min, schedule_sec,
    result,
    callback
) {
    var Match = this;

    if (!this.validateName(home_name)) {
        return callback(null, '홈팀명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
    }

    if (!this.validateName(away_name)) {
        return callback(null, '원정팀명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
    }

    if (!this.validateScore(home_score)) {
        return callback(null, '홈팀 점수가 적절하지 않습니다.');
    }

    if (!this.validateScore(away_score)) {
        return callback(null, '원정팀 점수가 적절하지 않습니다.');
    }

    if (!this.validateRate(rate_home)) {
        return callback(null, '홈팀 승리 배당률이 적절하지 않습니다.');
    }

    if (!this.validateRate(rate_away)) {
        return callback(null, '원정팀 승리 배당률이 적절하지 않습니다.');
    }

    if (!this.validateRate(rate_draw)) {
        return callback(null, '무승부 배당률이 적절하지 않습니다.');
    }

    if (!this.validateDate(schedule_date)) {
        return callback(null, '경기 일정 형식이 적절하지 않습니다.');
    }

    if (!this.validateTime(schedule_hour, 'hour')) {
        return callback(null, '경기 일정 형식이 적절하지 않습니다.');
    }

    if (!this.validateTime(schedule_min, 'min')) {
        return callback(null, '경기 시간(분) 형식이 적절하지 않습니다.');
    }

    if (!this.validateTime(schedule_sec, 'sec')) {
        return callback(null, '경기 시간(초) 형식이 적절하지 않습니다.');
    }

    var newMatch = new Match();
    newMatch.home.name = home_name;
    newMatch.home.score = home_score;
    newMatch.away.name = away_name;
    newMatch.away.score = away_score;
    newMatch.rate.home = rate_home;
    newMatch.rate.draw = rate_draw;
    newMatch.rate.away = rate_away;
    newMatch.state = state;
    newMatch.btype = btype;
    newMatch.gtype = gtype;
    newMatch.league = league_id;
    newMatch.kind = kind_id;
    newMatch.schedule.date = schedule_date;
    newMatch.schedule.hour = schedule_hour;
    newMatch.schedule.min = schedule_min;
    newMatch.schedule.sec = schedule_sec;
    newMatch.result = result;
    newMatch.save(function(err) {
        if (err) {
            callback(err);
        }
        return callback(null, null, newMatch);
    });
};

MatchSchema.statics.Update = function(
    id,
    home_name, home_score,
    away_name, away_score,
    rate_home, rate_draw, rate_away,
    state, btype, gtype,
    league_id,
    kind_id,
    schedule_date, schedule_hour, schedule_min, schedule_sec,
    result,
    callback
) {
    
    if (!this.validateName(home_name)) {
        return callback(null, '홈팀명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
    }

    if (!this.validateName(away_name)) {
        return callback(null, '원정팀명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
    }

    if (!this.validateScore(home_score)) {
        return callback(null, '홈팀 점수가 적절하지 않습니다.');
    }

    if (!this.validateScore(away_score)) {
        return callback(null, '원정팀 점수가 적절하지 않습니다.');
    }

    if (!this.validateRate(rate_home)) {
        return callback(null, '홈팀 승리 배당률이 적절하지 않습니다.');
    }

    if (!this.validateRate(rate_away)) {
        return callback(null, '원정팀 승리 배당률이 적절하지 않습니다.');
    }

    if (!this.validateRate(rate_draw)) {
        return callback(null, '무승부 배당률이 적절하지 않습니다.');
    }

    if (!this.validateDate(schedule_date)) {
        return callback(null, '경기 일정 형식이 적절하지 않습니다.');
    }

    if (!this.validateTime(schedule_hour, 'hour')) {
        return callback(null, '경기 일정 형식이 적절하지 않습니다.');
    }

    if (!this.validateTime(schedule_min, 'min')) {
        return callback(null, '경기 시간(분) 형식이 적절하지 않습니다.');
    }

    if (!this.validateTime(schedule_sec, 'sec')) {
        return callback(null, '경기 시간(초) 형식이 적절하지 않습니다.');
    }

    this.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            home: {
                name : home_name,
                score : home_score
            },
            away: {
                name : away_name,
                score : away_score
            },
            rate: {
                home: rate_home,
                draw: rate_draw,
                away: rate_away
            },
            state: state,
            btype: btype,
            gtype: gtype,
            league: league_id,
            kind: kind_id,
            schedule: {
                date: schedule_date,
                hour: schedule_hour,
                min: schedule_min,
                sec: schedule_sec
            },
            result: result,
            modified_at: Date.now()
        }
    }, function(err, match) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, match);
    });
};

MatchSchema.statics.Delete = function(id, callback) {
    this.findOneAndRemove({
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
    mongoose.model('Match', MatchSchema);
};
