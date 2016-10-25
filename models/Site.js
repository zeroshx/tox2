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
Site Model's Statics Begin.
******************************************************************/
SiteSchema.statics.validateId = function(id) {
    if (typeof(id) !== 'string') {
        return false;
    }
    return true;
};

SiteSchema.statics.validateName = function(name) {
    if (typeof(name) !== 'string') {
        return false;
    }
    return /^[가-힣a-zA-Z0-9]{2,16}$/g.test(name);
};

SiteSchema.statics.validateMemo = function(memo) {
    if (typeof(memo) !== 'string') {
        return false;
    }
    return memo.length < 200 ? true : false;
};

// SiteSchema.statics.Single = function(id, callback) {
//     this.findOne({
//         _id: id
//     }, function(err, site) {
//         if (err) {
//             return callback(err);
//         }
//         if (site) {
//             return callback(null, null, site);
//         } else {
//             return callback(null, '존재하지 않는 사이트입니다.');
//         }
//     });
// };

SiteSchema.statics.List = function(page, pageSize, filter, keyword, callback) {
    var Site = this;

    if (typeof(page) !== 'string' || typeof(pageSize) !== 'string') {
        return callback(null, '비정상적인 접근입니다.');
    }

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
    
    Site.count(query, function(err, count) {
        if (err) {
            return callback(err);
        }
        if (count !== 0) {
            page = parseInt(page);
            pageSize = parseInt(pageSize);
            Site.find(query).skip((page - 1) * pageSize).limit(pageSize).exec(function(err, sites) {
                if (err) {
                    return callback(err);
                }
                return callback(null, null, {
                    count: Math.ceil(count / pageSize),
                    sites: sites
                });
            });
        } else {
            return callback(null, '검색결과가 없습니다.');
        }
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
        newSite.memo = memo;
        newSite.save(function(err) {
            if (err) {
                callback(err);
            }
            return callback(null, null, newSite);
        });
    });
};

SiteSchema.statics.Update = function(id, name, memo, callback) {

    if (!this.validateId(id)) {
        return callback(null, '비정상적인 접근입니다.');
    }

    if (!this.validateName(name)) {
        return callback(null, '사이트명은 한글, 영문, 숫자 조합으로 2자 이상 16자 이내만 가능합니다.');
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
            modified_at: Date.now()
        }
    }, function(err, site) {
        if (err) {
            return callback(err);
        }
        if (site === null) {
            return callback(null, '수정에 실패하였습니다.');
        }
        return callback(null, null, site);
    });
};

SiteSchema.statics.Delete = function(id, callback) {

    if (!this.validateId(id)) {
        return callback(null, '비정상적인 접근입니다.');
    }

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
