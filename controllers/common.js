exports.refreshSession = function(req, res, next) {
    if (req.isAuthenticated()) {
        req.session.touch();
    }
    next();
};

exports.authenticate = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    return res.json({
        failure: '인증되지 않은 사용자입니다.'
    });
};
