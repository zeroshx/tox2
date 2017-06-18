TOX2ADMINAPP.service('AuthService', ['$q', '$http', '$window', '$rootScope',
  function($q, $http, $window, $rootScope) {

    this.Me =  function (success, failure) {
      var defer = $q.defer();

      $http.get('/user/me').then(
        function(response) {
          $rootScope.__SetUser('me', response.data);
          if (typeof success === 'function') return success(response.data, defer);
          defer.resolve();
        },
        function(response) {
          $rootScope.__DeleteUser();
          if (typeof failure === 'function') failure(response);
          defer.reject();
          $window.location = '/';
        }
      );
      return defer.promise;
    };

    this.GetNewMessages =  function (success, failure) {
      var defer = $q.defer();

      $http.get('/client/message/customer/new-received-list').then(
        function(response) {
          $rootScope.__SetUser('messages', response.data);
          if (typeof success === 'function') return success(response.data, defer);
          defer.resolve();
        },
        function(response) {
          $rootScope.__DeleteUser();
          if (typeof failure === 'function') failure(response);
          defer.reject();
          $window.location = '/';
        }
      );
      return defer.promise;
    };
  }
]);
