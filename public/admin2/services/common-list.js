angular.module('TOX2ADMINAPP').service('CommonListService', [
  '$q', 'CRUDFactory',
  function($q, CRUDFactory) {
    var __ = this;

    __.Banks = function() {
      return __.BankList(
        function(data, defer) {
          defer.resolve(data);
        });
    };

    __.BankList = function(success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        '../ect/banks.json',
        {},
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

    __.Sites = function() {
      return __.SiteList(
        function(data, defer) {
          defer.resolve(data);
        });
    };

    __.SiteList = function(success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        '/site/all', {},
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

    __.Distributors = function() {
      return __.DistributorList(
        function(data, defer) {
          defer.resolve(data);
        });
    };

    __.DistributorList = function(success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        '/distributor/all',
        {},
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

    __.Levels = function() {
      return __.LevelList(
        function(data, defer) {
          defer.resolve(data);
        });
    };

    __.LevelList = function(success) {
      var defer = $q.defer();
      CRUDFactory.READ(
        '/site/level/all', {},
        function(data) {
          if (typeof success === 'function') return success(data, defer);
          defer.resolve();
        },
        function(error) {
          defer.reject();
        });
      return defer.promise;
    };

    __.MatchKinds = function() {
      return __.MatchKindList(
        function(data, defer) {
          defer.resolve(data);
        });
    };

    __.MatchKindList = function(success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        '/match/kind/all',
        {},
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
