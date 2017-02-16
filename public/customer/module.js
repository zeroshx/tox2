var ApplicationName = '__customer';

angular.module('Index', []);
angular.module('My', []);

angular.module(ApplicationName, [
  'ngRoute',
  'ngResource',
  'Index',
  'My'
]);
