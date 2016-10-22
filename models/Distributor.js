var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DistributorSchema = new Schema({
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
Distributor Model's Statics Begin.
******************************************************************/
DistributorSchema.statics.validateName = function(name) {
    return /^[가-힣a-zA-Z0-9]{2,16}$/g.test(name);
};

DistributorSchema.statics.validateMemo = function(memo) {
    return memo.length < 256 ? true : false;
};

DistributorSchema.statics.Single = function(id, callback) {
    this.findOne({
        _id: id
    }, function(err, dist) {
        if (err) {
            return callback(err);
        }
        if (dist) {
            return callback(null, null, dist);
        } else {
            return callback(null, '존재하지 않는 총판입니다.');
        }
    });
};

DistributorSchema.statics.List = function(callback) {
    this.find(function(err, dists) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, dists);
    });
};

DistributorSchema.statics.Create = function(name, memo, callback) {

    var Distributor = this;

    if (!this.validateName(name)) {
        return callback(null, '총판명은 한글, 영문, 숫자 조합으로 2자 이상 16자 이내만 가능합니다.');
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
            return callback(null, '이미 존재하는 총판입니다.');
        }
        var newDist = new Distributor();
        newDist.name = name;
        if (memo) {
            newDist.memo = memo;
        }
        newDist.save(function(err) {
            if (err) {
                callback(err);
            }
            return callback(null, null, newDist);
        });
    });
};

DistributorSchema.statics.Update = function(id, memo, callback) {
    this.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            memo: memo
        }
    }, function(err, dist) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, dist);
    });
};

DistributorSchema.statics.Delete = function(id, callback) {
    this.findOneAndRemove({
        _id: id
    }, function(err, dist) {
        if (err) {
            return callback(err);
        }
        return callback(null, null, dist);
    });
};
/******************************************************************
Distributor Model's Statics End.
******************************************************************/

module.exports = function() {
    mongoose.model('Distributor', DistributorSchema);
};
