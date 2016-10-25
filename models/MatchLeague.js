var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchLeagueSchema = new Schema({
    name: {
        type: String,
        required: [true, '리그명이 없습니다.']
    },
    country: {
        type: String,
        default: ''
    },
    memo: {
        type: String,
        default: ''
    },
    image_path: {
        type: String,
        default: ''
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
MatchLeagueSchema Model's Statics Begin.
******************************************************************/
MatchLeagueSchema.statics.validateName = function(name) {
    return /^[가-힣a-zA-Z0-9()]{2,30}$/g.test(name);
};

MatchLeagueSchema.statics.validateCountry = function(country) {
    return /^[가-힣a-zA-Z0-9()]{2,30}$/g.test(country);
};

MatchLeagueSchema.statics.validateMemo = function(memo) {
    return memo.length < 256 ? true : false;
};

MatchLeagueSchema.statics.Single = function(id, callback) {
    this.findOne({
        _id: id
    }, function(err, mlg) {
        if (err) {
            return callback(err);
        }
        if (lg) {
            return callback(null, null, mlg);
        } else {
            return callback(null, '존재하지 않는 리그입니다.');
        }
    });
};

MatchLeagueSchema.statics.List = function(callback) {
    this.find(function(err, mlgs) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, mlgs);
    });
};

MatchLeagueSchema.statics.Create = function(name, country, memo, image_path, callback) {

    var MatchLeague = this;

    if (!this.validateName(name)) {
        return callback(null, '리그명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
    }

    if (!this.validateCountry(country)) {
        return callback(null, '국가명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
    }

    if (!this.validateMemo(memo)) {
        return callback(null, '메모는 255자 이내만 가능합니다.');
    }

    this.findOne({
        name: name
    }, function(err, dist) {
        if (err) {
            callback(err);
        }
        if (dist) {
            return callback(null, '이미 존재하는 리그입니다.');
        }
        var newMlg = new MatchLeague();
        newMlg.name = name;
        newMlg.country = country;
        newMlg.memo = memo;
        newMlg.image_path = image_path;
        newMlg.save(function(err) {
            if (err) {
                callback(err);
            }
            return callback(null, null, newMlg);
        });
    });
};

MatchLeagueSchema.statics.Update = function(id, name, memo, country, image_path, callback) {

    if (!this.validateName(name)) {
        return callback(null, '리그명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
    }

    if (!this.validateCountry(country)) {
        return callback(null, '국가명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
    }

    if (!this.validateMemo(memo)) {
        return callback(null, '메모는 255자 이내만 가능합니다.');
    }

    this.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            name: name,
            memo: memo,
            country: country,
            image_path: image_path,
            modified_at: Date.now()
        }
    }, function(err, mlg) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, mlg);
    });
};

MatchLeagueSchema.statics.Delete = function(id, callback) {
    this.findOneAndRemove({
        _id: id
    }, function(err, mlg) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, mlg);
    });
};
/******************************************************************
MatchLeagueSchema Model's Statics End.
******************************************************************/

module.exports = function() {
    mongoose.model('MatchLeague', MatchLeagueSchema);
};
