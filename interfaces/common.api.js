const util = require('util');

exports.Number2Currency = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

exports.Currency2Number = (cur) => {
  return Number(cur.replace(/\,/g,""));
};

exports.IsValidString = (value) => {
  if(typeof value !== 'string') return false;
  if(value === '') return false;
  return true;
};

exports.Inspect = (value, depth, showHidden) => {
  if(!depth) depth = 2;
  if(!showHidden) showHidden = false;
  console.log(util.inspect(value, { showHidden: showHidden, depth: depth }));
};
