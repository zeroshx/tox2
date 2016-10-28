var ApplicationName = '_app';

angular.module('Auth',[]);
angular.module('Distributor',[]);
angular.module('Site',[]);
angular.module('User',[]);
angular.module('Match',['ngFileUpload']);

var _app = angular.module(ApplicationName, [
  'ngRoute',
  'ngResource',
  'Auth',
  'Site',
  'Distributor',
  'User',
  'Match'
]);

_app.config(['$locationProvider', function config($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
