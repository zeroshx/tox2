var ApplicationName = '_app';
var _app = angular.module(ApplicationName, [
  'ngRoute',
  'ngResource'
]);

_app.config(['$locationProvider', function config($locationProvider) {
  $locationProvider.hashPrefix('!');
}]);

_app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.actions = {
    get: {
      method: 'GET'
    },
    auth : {
      method: 'POST'
    },
    create: {
      method: 'POST'
    },
    update: {
      method: 'PUT'
    },
    delete: {
      method: 'DELETE'
    },
    list: {
      method: 'GET',
      isArray: true
    }
  };
}]);
