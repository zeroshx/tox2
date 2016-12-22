exports.AuthRouting = function(req, res, next) {
  if (req.session.auth) {
    if(req.session.auth.state === '관리자' || req.session.auth.state === '운영자') {
        return res.render('admin');
    }
    //return res.render();  //user
  }
  return next();
};

exports.VerifyAdmin = function(req, res, next) {
  if (req.session.auth) {
    if(req.session.auth.state === '관리자' || req.session.auth.state === '운영자') {
        return next();
    }
  }
  return res.sendStatus(401);
};

exports.VerifyUser = function(req, res, next) {
  if (req.session.auth) {
    return next();
  }
  return res.sendStatus(401);
};

exports.SetAuthSession = function(req, user) {
  req.session.auth = {
    id: user._id,
    uid: user.uid,
    state: user.state,
  }
};

exports.GetAuthSession = function(req) {
  return req.session.auth;
};
