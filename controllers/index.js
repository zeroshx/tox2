var User = require('mongoose').model('User');

exports.create = function(req, res, next) {
    var user = new User({
        username : req.body.username,
        password : req.body.password
    });
    console.log(req.body);
    user.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};
