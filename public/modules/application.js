var ApplicationName = '_app';
var _app = angular.module(ApplicationName, [
  'ngRoute',
  'ngResource',
  'Auth',
  'Site',
  'Distributor',
  'User'
]);

_app.config(['$locationProvider', function config($locationProvider) {
  $locationProvider.hashPrefix('!');
}]);
