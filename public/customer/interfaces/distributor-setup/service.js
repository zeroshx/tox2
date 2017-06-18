angular.module('TOX2APP').service('DistributorSetupService', [
  '$q', '$window', 'CRUDFactory',
  function($q, $window, CRUDFactory) {

    var _path = '/distributor/customer';

    this.Init = function() {
      var defer = $q.defer();
      defer.resolve({
        path: _path
      });
      return defer.promise;
    };

    this.Config = function() {
      return this.GetConfig(function (data, defer) {
        defer.resolve({
          data: data
        });
      });
    };

    this.GetConfig = function(success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _path + '/config',
        {},
        function(data) {
          if (typeof success === 'function') return success(data, defer);
          defer.resolve();
        },
        function(error) {
          if (typeof failure === 'function') failure(error);
          defer.reject();
        });
      return defer.promise;
    };

    this.CreateDistributor = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.CREATE(
        _path,
        data,
        function(data) {
          if (typeof success === 'function') return success(data, defer);
          defer.resolve();
        },
        function(error) {
          if (typeof failure === 'function') failure(error);
          defer.reject();
        });
      return defer.promise;
    };

  }
]);
