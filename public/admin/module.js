var ApplicationName = '__admin';

angular.module('Index', []);
angular.module('Auth', []);
angular.module('Distributor', []);
angular.module('Site', []);
angular.module('User', []);
angular.module('Match', ['ngFileUpload']);
angular.module('Config', []);
angular.module('Client', []);
angular.module('Asset', []);
angular.module('Todo', []);

angular.module(ApplicationName, [
  'ngRoute',
  'ngResource',
  'Index',
  'Auth',
  'Site',
  'Distributor',
  'User',
  'Match',
  'Config',
  'Client',
  'Asset',
  'Todo'
]);
