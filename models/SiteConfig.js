var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
    site: {
        type: String,
        index: true,
        unique: true
    },
    betCancelLimit: {
        type: Number
    },
    betCancelCount: {
        type: Number
    },
    kindConfig: [{
        name: {
            type: String
        },
        som: { // single or multi
            type: String
        },
        maxMulti: {
            type: Number
        },
        nah: { // normal and handicap
            type: Boolean
        },
        nau: { // normal and underover
            type: Boolean
        },
        hau: { // handicap and underover
            type: Boolean
        }
    }],
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
        if (filter === '사이트') {
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
    site,
    betCancelLimit,
    betCancelCount,
    kindConfig,
    callback
) {
    var Document = this;

    Document.CheckPermission(site, function(err, doc) {
        if (err) {
            return callback(err);
        }
        if (doc) { // true or false
            return callback(null, '이미 설정 내역이 존재하는 사이트입니다.(' + site + ')');
        } else {

            var moment = new Date();
            var newDoc = new Document();
            newDoc.site = site;
            newDoc.betCancelLimit = betCancelLimit;
            newDoc.betCancelCount = betCancelCount;
            newDoc.kindConfig = kindConfig;
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
    betCancelLimit,
    betCancelCount,
    kindConfig,
    callback
) {

    var Document = this;
    var moment = new Date();

    Document.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            betCancelLimit: betCancelLimit,
            betCancelCount: betCancelCount,
            kindConfig: kindConfig,
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

Model.statics.CheckPermission = function(site, callback) {

    var Document = this;

    Document.findOne({
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
    mongoose.model('SiteConfig', Model);
};
