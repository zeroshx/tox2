angular.module('TOX2APP').service('DistributorInfoService', [
  '$q', '$window', 'CRUDFactory',
  function($q, $window, CRUDFactory) {

    var _path = '/distributor/customer';
    var _query = {
      page: 1,
      pageSize: 20
    };

    this.Init = function() {
      return this.List(_query,
        function(data, defer) {
          defer.resolve({
            data: data,
            query: _query,
            path: _path
          });
        });
    };

    this.Info = function() {
      return this.Overview({},
        function(data, defer) {          
          defer.resolve({
            data: data
          });
        });
    };

    this.Overview = function(query, success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _path,
        query,
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

    this.List = function(query, success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _path + '/member',
        query,
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

    this.Update = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _path + '/modify',
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

    this.DropOut = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _path + '/dropout',
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

    this.AwaiterAccept = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _path + '/accept',
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

    this.AwaiterReject = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _path + '/reject',
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

    this.AwaiterRejectAll = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _path + '/reject/all',
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

    this.HandOver = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _path + '/handover',
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

    this.Expell = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _path + '/expell',
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
