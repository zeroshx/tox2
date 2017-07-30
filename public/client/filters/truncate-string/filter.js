angular.module('TOX2APP')
  .filter('truncate', function() {
    return function(str, length) {
      if (!angular.isString(str) || str === '') return null;
      if (str.length > length) {
        return str.substr(0, length) + '...';
      } else {
        return str;
      }
    };
  });
