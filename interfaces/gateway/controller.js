function Trim(body){
  if (Object.prototype.toString.call(body) === '[object Object]') {
    Object.keys(body).forEach(function (key){
      var value = body[key];

      if (typeof value === 'string')
        return body[key] = value.trim();

      if (typeof value === 'object')
        Trim(value);
    });
  }
}

exports.InputTrim = function (req, res, next) {
  if (req.body) {
    Trim(req.body);
  }
  if (req.query) {
    Trim(req.query);
  }
  next();
};
