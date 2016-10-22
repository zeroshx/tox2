var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, '사이트 이름이 없습니다.']
    },
    memo: {
        type: String,
        maxlength: 255,
        default: 'Empty'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

/******************************************************************
Site Model's Statics Begin.
******************************************************************/
SiteSchema.statics.validateName = function(name) {
    return /^[가-힣a-zA-Z0-9]{2,16}$/g.test(name);
};

SiteSchema.statics.validateMemo = function(memo) {
    return memo.length < 256 ? true : false;
};

SiteSchema.statics.Single = function(id, callback) {
    this.findOne({
        _id: id
    }, function(err, site) {
        if (err) {
            return callback(err);
        }
        if (site) {
            return callback(null, null, site);
        } else {
            return callback(null, '존재하지 않는 사이트입니다.');
        }
    });
};

SiteSchema.statics.List = function(callback) {
    this.find(function(err, sites) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, sites);
    });
};

SiteSchema.statics.Create = function(name, memo, callback) {

    var Site = this;

    if (!this.validateName(name)) {
        return callback(null, '사이트명은 한글, 영문, 숫자 조합으로 2자 이상 16자 이내만 가능합니다.');
    }

    if (!this.validateMemo(memo)) {
        return callback(null, '메모는 255자 이내만 가능합니다.');
    }

    this.findOne({
        name: name
    }, function(err, site) {
        if (err) {
            callback(err);
        }
        if (site) {
            return callback(null, '이미 존재하는 사이트입니다.');
        }
        var newSite = new Site();
        newSite.name = name;
        if (memo) {
            newSite.memo = memo;
        }
        newSite.save(function(err) {
            if (err) {
                callback(err);
            }
            return callback(null, null, newSite);
        });
    });
};

SiteSchema.statics.Update = function(id, memo, callback) {
    this.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            memo: memo
        }
    }, function(err, site) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, site);
    });
};

SiteSchema.statics.Delete = function(id, callback) {
    this.findOneAndRemove({
        _id: id
    }, function(err, site) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, site);
    });
};
/******************************************************************
Site Model's Statics End.
******************************************************************/

module.exports = function() {
    mongoose.model('Site', SiteSchema);
};
