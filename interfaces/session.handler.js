exports.SetAuthSession = (req, user) => {
  req.session.auth = {
    id: user._id,
    uid: user.uid,
    nick: user.nick,
    site: user.site,
    distributor: user.distributor,
    level: user.level,
    state: user.state
  };
};

exports.AddAuthSession = (req, property, value) => {
  if (req.session.hasOwnProperty('auth')) {
    return req.session.auth[property] = value;
  }
  req.session.auth = {};
  req.session.auth[property] = value;
};

exports.GetAuthSession = (req) => {
  return req.session.auth;
};

exports.DestroyAuthSession = (req, callback) => {
  req.session.destroy(err => {
    if (err) {}
    callback();
  });
  return;
};
