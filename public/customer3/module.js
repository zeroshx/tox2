var ApplicationName = '__customer';

angular.module('Index', []);
angular.module('My', []);
angular.module('Community', []);
angular.module('Distributor', []);

angular.module(ApplicationName, [
  'ngRoute',
  'ngResource',
  'Index',
  'My',
  'Community',
  'Distributor'
]);
