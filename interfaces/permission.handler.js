var session = require('./session.handler.js');

exports.VerifyAdminApi = function(req, res, next) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if(auth.state === '운영자') {
        return next();
    }
  }
  return res.sendStatus(403);
};

exports.VerifyAdmin = function(req, res, next) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if(auth.state === '운영자') {
        return next();
    }
  }
  return res.redirect('/');
};

exports.VerifySupervisorApi = function(req, res, next) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if(auth.state === '관리자' || auth.state === '운영자') {
        return next();
    }
  }
  return res.sendStatus(403);
};

exports.VerifySupervisorMessenger = function(req) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if(auth.state === '관리자' || auth.state === '운영자') {
        return true;
    }
  }
  return false;
};

exports.VerifySupervisor = function(req, res, next) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if(auth.state === '관리자' || auth.state === '운영자') {
        return next();
    }
  }
  return res.redirect('/');
};

exports.VerifyTesterApi = function(req, res, next) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if(auth.state === '테스터' || auth.state === '관리자' || auth.state === '운영자') {
        return next();
    }
  }
  return res.sendStatus(403);
};

exports.VerifyTester = function(req, res, next) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if(auth.state === '테스터' || auth.state === '관리자' || auth.state === '운영자') {
        return next();
    }
  }
  return res.redirect('/');
};

exports.VerifyUserApi = function(req, res, next) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if(auth.state === '일반' || auth.state === '테스터' || auth.state === '관리자' || auth.state === '운영자') {
        return next();
    }
  }
  return res.sendStatus(403);
};

exports.VerifyUser = function(req, res, next) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if(auth.state === '일반' || auth.state === '테스터' || auth.state === '관리자' || auth.state === '운영자') {
        return next();
    }
  }
  return res.redirect('/');
};

exports.VerifySemiUser = function(req, res, next) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    return next();
  }
  return res.redirect('/');
};
