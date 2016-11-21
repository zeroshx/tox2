var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = new Schema({
    name: {
        type: String,
        unique: true,
        index: true
    },
    country: {
        type: String,
        index: true
    },
    imagePath: {
        type: String
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
        if (filter === '리그') {
            query.name = {
                $regex: '.*' + keyword + '.*'
            };
        } else if (filter === '국가') {
            query.country = {
                $regex: '.*' + keyword + '.*'
            };
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
        return callback(null, null, {
            docs: docs
        });
    });
};

Model.statics.Create = function(name, country, imagePath, callback) {

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
        newDoc.name = name;
        newDoc.country = country;
        newDoc.imagePath = imagePath;
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

Model.statics.Update = function(id, country, imagePath, callback) {

    var Document = this;
    var moment = new Date();

    var query = {
        $set: {
            country: country,
            modifiedAt: moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString()
        }
    };
    if (imagePath.length > 0) {
        query.$set.imagePath = imagePath;
    }

    Document.findOneAndUpdate({
        _id: id
    }, query, {
        runValidators: true
    }, function(err, doc) {
        if (err) {
            return callback(err);
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
/******************************************************************
Model's Statics End.
******************************************************************/

module.exports = function() {
    mongoose.model('MatchLeague', Model);
};
