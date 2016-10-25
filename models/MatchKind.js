var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchKindSchema = new Schema({
    name: {
        type: String,
        required: [true, '종목명이 없습니다.']
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
MatchKindSchema Model's Statics Begin.
******************************************************************/
MatchKindSchema.statics.validateName = function(name) {
    return /^[가-힣a-zA-Z0-9()]{2,30}$/g.test(name);
};

MatchKindSchema.statics.validateMemo = function(memo) {
    return memo.length < 256 ? true : false;
};

MatchKindSchema.statics.Single = function(id, callback) {
    this.findOne({
        _id: id
    }, function(err, mk) {
        if (err) {
            return callback(err);
        }
        if (mk) {
            return callback(null, null, mk);
        } else {
            return callback(null, '존재하지 않는 종목입니다.');
        }
    });
};

MatchKindSchema.statics.List = function(callback) {
    this.find(function(err, mks) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, mks);
    });
};

MatchKindSchema.statics.Create = function(name, memo, image_path, callback) {

    var MatchKind = this;

    if (!this.validateName(name)) {
        return callback(null, '종목명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
    }

    if (!this.validateMemo(memo)) {
        return callback(null, '메모는 255자 이내만 가능합니다.');
    }

    this.findOne({
        name: name
    }, function(err, mk) {
        if (err) {
            callback(err);
        }
        if (mk) {
            return callback(null, '이미 존재하는 종목입니다.');
        }
        var newMk = new MatchKind();
        newMk.name = name;
        newMk.memo = memo;
        newMk.save(function(err) {
            if (err) {
                callback(err);
            }
            return callback(null, null, newMk);
        });
    });
};

MatchKindSchema.statics.Update = function(id, name, memo, image_path, callback) {

    if (!this.validateName(name)) {
        return callback(null, '종목명은 한글, 영문, 숫자 조합으로 2자 이상 30자 이내만 가능합니다.');
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
            image_path: image_path,
            modified_at: Date.now()
        }
    }, function(err, dist) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, dist);
    });
};

MatchKindSchema.statics.Delete = function(id, callback) {
    this.findOneAndRemove({
        _id: id
    }, function(err, mk) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, mk);
    });
};
/******************************************************************
MatchLeagueSchema Model's Statics End.
******************************************************************/

module.exports = function() {
    mongoose.model('MatchKind', MatchKindSchema);
};
