var validator = require('./validator.js');
var Model = require('mongoose').model('MatchKind');
var nodemailer = require('../init/nodemailer.js');
var formidable = require('formidable');
var fs = require("fs");
var expressConfig = require('../configs/express.js');

var root = 'controller/matchkind.js';

exports.List = function(req, res) {
    Model.List(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
        function(err, msg, doc) {
            if (err) { // internal error
                nodemailer(root + ':List', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                return res.json(doc);
            }
        });
};


exports.ListAll = function(req, res) {
    Model.ListAll(function(err, msg, doc) {
        if (err) { // internal error
            nodemailer(root + ':ListAll', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.json(doc);
        }
    });
};

exports.Create = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, body, file) {
        var imagePath = '';
        var imgExist = false;
        if (file.image !== undefined) {
            var fileSize = Number(file.image.size);
            if (fileSize > (200 * 1024)) { // 200kb
                return res.json({
                    failure: '파일 사이즈가 너무 큽니다.'
                });
            }
            imgExist = true;
            var now = new Date();
            now = now.getTime();
            imagePath = expressConfig.kind_upload_path + now + file.image.name;
            var oldPath = file.image.path;
            var newPath = __dirname + "/../public/" + imagePath;
        }

        var msg = validator.run([
            {
                required: true,
                value: body.name,
                validator: 'kind'
            }
        ]);

        if (msg) return res.json({
            failure: msg
        });

        Model.Create(
            body.name,
            imagePath,
            function(err, msg, doc) {
                if (err) { // internal error
                    nodemailer(root + ':Create', JSON.stringify(err));
                    return res.sendStatus(500);
                } else if (msg) { // exception control
                    return res.json({
                        failure: msg
                    });
                } else {
                    if (imgExist) {
                        fs.readFile(oldPath, function(err, data) {
                            if (!err) {
                                fs.writeFile(newPath, data, function(err) {
                                    if (!err) {
                                        fs.unlink(oldPath, function(err) {
                                            return res.json(doc);
                                        });
                                    } else {
                                        return res.json({
                                            failure: '이미지 등록에 실패하였습니다.'
                                        });
                                    }
                                });
                            } else {
                                return res.json({
                                    failure: '이미지 등록에 실패하였습니다.'
                                });
                            }
                        });
                    } else {
                        var targetPath = __dirname + "/../public/" + doc.imagePath;
                        fs.unlink(targetPath, function(err) {
                            return res.json(doc);
                        });
                    }
                }
            });
    });
};

exports.Update = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, body, file) {
        var imagePath = '';
        var imgExist = false;
        if (file.image !== undefined) {
            var fileSize = Number(file.image.size);
            if (fileSize > (200 * 1024)) {
                return res.json({
                    failure: '파일 사이즈가 너무 큽니다.'
                });
            }
            imgExist = true;
            var now = new Date();
            now = now.getTime();
            imagePath = expressConfig.kind_upload_path + now + file.image.name;
            var oldPath = file.image.path;
            var newPath = __dirname + "/../public/" + imagePath;
        }
        Model.Update(
            req.params.id,
            imagePath,
            function(err, msg, doc) {
                if (err) { // internal error
                    nodemailer(root + ':Update', JSON.stringify(err));
                    return res.sendStatus(500);
                } else if (msg) { // exception control
                    return res.json({
                        failure: msg
                    });
                } else {
                    if (imgExist) {
                        fs.readFile(oldPath, function(err, data) {
                            if (!err) {
                                fs.writeFile(newPath, data, function(err) {
                                    if (!err) {
                                        fs.unlink(oldPath, function(err) {
                                            var targetPath = __dirname + "/../public/" + doc.imagePath;
                                            fs.unlink(targetPath, function(err) {
                                                return res.json(doc);
                                            });
                                        });
                                    } else {
                                        return res.json({
                                            failure: '이미지 등록에 실패하였습니다.'
                                        });
                                    }
                                });
                            } else {
                                return res.json({
                                    failure: '이미지 등록에 실패하였습니다.'
                                });
                            }
                        });
                    } else {
                        return res.json(doc);
                    }
                }
            });
    });
};

exports.Delete = function(req, res) {
    Model.Delete(
        req.params.id,
        function(err, msg, doc) {
            if (err) { // internal error
                nodemailer(root + ':Delete', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                var targetPath = __dirname + "/../public/" + doc.imagePath;
                fs.unlink(targetPath, function(err) {
                    return res.json(doc);
                });
            }
        });
};
