var ApplicationName = '_app';

angular.module('Index',[]);
angular.module('Auth',[]);
angular.module('Distributor',[]);
angular.module('Site',[]);
angular.module('User',[]);
angular.module('Match',['ngFileUpload']);
angular.module('Config',[]);
angular.module('Client',[]);

var _app = angular.module(ApplicationName, [
  'ngRoute',
  'ngResource',
  'Index',
  'Auth',
  'Site',
  'Distributor',
  'User',
  'Match',
  'Config',
  'Client'
]);
