var MatchKind = require('mongoose').model('MatchKind');
var nodemailer = require('../init/nodemailer.js');
var formidable = require('formidable');
var fs = require("fs");
var expressConfig = require('../configs/express.js');

exports.List = function(req, res) {
    MatchKind.List(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
        function(err, msg, mks) {
            if (err) { // internal error
                nodemailer('controller/matchkind.js:List', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                return res.json(mks);
            }
        });
};


exports.ListAll = function(req, res) {
    MatchKind.ListAll(function(err, msg, mks) {
        if (err) { // internal error
            nodemailer('controller/match.js:ListAll', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.json(mks);
        }
    });
};

exports.Create = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, body, file) {
        var imagePath = '';
        var imgExist = false;
        if (file.image !== undefined) {
            var fileSize = parseInt(file.image.size);
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
        MatchKind.Create(
            body.name,
            imagePath,
            function(err, msg, mk) {
                if (err) { // internal error
                    nodemailer('controller/matchkind.js:Create', JSON.stringify(err));
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
                                            return res.json(mk);
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
                        var targetPath = __dirname + "/../public/" + mk.imagePath;
                        fs.unlink(targetPath, function(err) {
                            return res.json(mk);
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
            var fileSize = parseInt(file.image.size);
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
        MatchKind.Update(
            req.params.id,
            body.name,
            imagePath,
            function(err, msg, mk) {
                if (err) { // internal error
                    nodemailer('controller/matchkind.js:Update', JSON.stringify(err));
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
                                            var targetPath = __dirname + "/../public/" + mk.imagePath;
                                            fs.unlink(targetPath, function(err) {
                                                return res.json(mk);
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
                        return res.json(mk);
                    }
                }
            });
    });
};

exports.Delete = function(req, res) {
    MatchKind.Delete(
        req.params.id,
        function(err, msg, mk) {
            if (err) { // internal error
                nodemailer('controller/matchkind.js:Delete', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                var targetPath = __dirname + "/../public/" + mk.imagePath;
                fs.unlink(targetPath, function(err) {
                    return res.json(mk);
                });
            }
        });
};
