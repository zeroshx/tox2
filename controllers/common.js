exports.isLoggedIn = function(req, res, next) {
    if (req.session.auth) {
        next();
    }
    return res.redirect('/');
};
