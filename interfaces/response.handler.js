var nodemailer = require('./nodemailer.handler.js');
var session = require('./session.handler.js');

exports.Error = (req, res, err) => {
  if (err) {
    if (typeof(err) !== 'object') err = {
      message: err
    };
    nodemailer.ErrorReport(JSON.stringify(err));
  }
  session.DestroyAuthSession(req, () => {
    res.sendStatus(500);
  });
};

exports.Exception = (req, res, msg) => {
  res.status(200).json({
    failure: msg
  });
};

exports.Finish = (req, res, data) => {
  res.status(200).json(data);
};

exports.Status = (req, res, status) => {
  res.sendStatus(status);
};

exports.Redirect = (req, res, path) => {
  res.redirect(path);
};

exports.Render = (req, res, file, data) => {
  data.csrfToken = req.csrfToken();
  data._csrf = req.csrfToken();
  res.render(file, data);
};
