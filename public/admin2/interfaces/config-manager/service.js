angular.module('TOX2ADMINAPP').service('ManagerService', [
  '$q', 'CRUDFactory',
  function($q, CRUDFactory) {
    var __ = this;
    var _path = 'config-manager';
    var _url = '/config/manager';

    __.Init = function() {
      return __.One(function(data, defer) {
        defer.resolve({
          url: _url,
          path: _path,
          doc: data
        });
      });
    };

    __.One = function(success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _url, {},
        function(data) {
          if (typeof success === 'function') return success(data, defer);
          defer.resolve();
        },
        function(error) {
          if (typeof failure === 'function') return failure(error, defer);
          defer.reject();
        });
      return defer.promise;
    };

    __.SaveSignupConfig = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.CREATE(
        _url + '/signup',
        data,
        function(data) {
          if (typeof success === 'function') return success(data, defer);
          defer.resolve();
        },
        function(error) {
          if (typeof failure === 'function') return failure(error, defer);
          defer.reject();
        });
      return defer.promise;
    };

    __.AddMessengerRoom = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.CREATE(
        _url + '/messenger/room',
        data,
        function(data) {
          if (typeof success === 'function') return success(data, defer);
          defer.resolve();
        },
        function(error) {
          if (typeof failure === 'function') return failure(error, defer);
          defer.reject();
        });
      return defer.promise;
    };

    __.RemoveMessengerRoom = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _url + '/messenger/room',
        data,
        function(data) {
          if (typeof success === 'function') return success(data, defer);
          defer.resolve();
        },
        function(error) {
          if (typeof failure === 'function') return failure(error, defer);
          defer.reject();
        });
      return defer.promise;
    };

  }
]);
