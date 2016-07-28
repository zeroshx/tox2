exports.toJsonResult = function (type, value) {
  var res = {};
  if(type == 'error') {
    res = {
      error : value
    };
  } else if(type == 'data') {
    res = {
      type : type,
      data : value
    };
  } else if(type == 'message') {
    res = {
      type : type,
      message : value
    };
  } else if(type == 'boolean') {
    res = {
      type : type,
      boolean : value
    };
  }
  return res;
};
