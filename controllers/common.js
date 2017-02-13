exports.VerifyAdminApi = function(req, res, next) {
  if (req.session.auth) {
    if(req.session.auth.state === '관리자' || req.session.auth.state === '운영자') {
        return next();
    }
  }
  return res.sendStatus(500);
};

exports.VerifyAdmin = function(req, res, next) {
  if (req.session.auth) {
    if(req.session.auth.state === '관리자' || req.session.auth.state === '운영자') {
        return next();
    }
  }
  return res.redirect('/');
};

exports.VerifyUserApi = function(req, res, next) {
  if (req.session.auth) {
    return next();
  }
  return res.sendStatus(500);
};

exports.VerifyUser = function(req, res, next) {
  if (req.session.auth) {
    return next();
  }
  return res.redirect('/');
};

exports.SetAuthSession = function(req, user) {
  req.session.auth = {
    id: user._id,
    uid: user.uid,
    nick: user.nick,
    state: user.state
  };
  return;
};

exports.GetAuthSession = function(req) {
  return req.session.auth;
};

exports.DestroyAuthSession = function(req, callback) {
  req.session.destroy(function(err) {
    if (err) {
    }
    callback();
  });
  return;
};

exports.Number2Currency = function(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

exports.Currency2Number = function(cur) {
  return Number(cur.replace(/\,/g,""));
};
