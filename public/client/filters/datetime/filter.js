angular.module('TOX2APP')
  .filter('datetime', ['$filter', function ($filter) {
    var angularDateFilter = $filter('date');
    return function(date) {
       return angularDateFilter(date, 'yyyy-MM-dd HH:mm:ss', '+0900');
    }
  }]);
