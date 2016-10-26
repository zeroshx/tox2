var ApplicationName = '_app';

angular.module('Auth',[]);
angular.module('Distributor',[]);
angular.module('Site',[]);
angular.module('User',[]);

var _app = angular.module(ApplicationName, [
  'ngRoute',
  'ngResource',
  'Auth',
  'Site',
  'Distributor',
  'User'
]);

_app.config(['$locationProvider', function config($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
