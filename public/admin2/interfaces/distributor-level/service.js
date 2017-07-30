angular.module('TOX2ADMINAPP').service('DistributorLevelService', [
  '$q', 'CRUDFactory',
  function($q, CRUDFactory) {
    var __ = this;
    var _path = 'distributor-level';
    var _url = '/distributor/level';

    var _query = {
      page: 1,
      pageSize: 30,
      searchKeyword: '',
      searchFilter: ''
    };

    __.Init = function() {
      return __.List(_query,
        function(data, defer) {
          defer.resolve({
            query: _query,
            url: _url,
            path: _path,
            list: data
          });
        });
    };

    __.List = function(query, success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _url,
        query,
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

    __.Add = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.CREATE(
        _url,
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

    __.Modify = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _url,
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

    __.Remove = function(id, success, failure) {
      var defer = $q.defer();
      CRUDFactory.DELETE(
        _url,
        id,
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
