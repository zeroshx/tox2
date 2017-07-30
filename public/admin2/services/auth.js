TOX2ADMINAPP.service('AuthService', ['$q', '$window', '$rootScope', 'CRUDFactory',
  function($q, $window, $rootScope, CRUDFactory) {
    var __ = this;

    __.Auth = function(success, error) {
      return __.Me(success, error)
        .then(function(legacy) {
          __.GetNewMessages();
        });
    };

    __.Me = function(success, failure) {
      var defer = $q.defer();

      CRUDFactory.READ(
        '/user/me', {},
        function(data) {
          $rootScope.__SetUser('me', data);
          if (typeof success === 'function') return success(data, defer);
          defer.resolve();
        },
        function(error) {
          $rootScope.__DeleteUser();
          defer.reject();
        });

      return defer.promise;
    };

    __.GetNewMessages = function(success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        '/client/message/customer/new-received-list', {},
        function(data) {
          $rootScope.__SetUser('messages', data);
          if (typeof success === 'function') return success(data, defer);
          defer.resolve();
        },
        function(error) {
          $rootScope.__DeleteUser();
          defer.reject();
        });
      return defer.promise;
    };
  }
]);
