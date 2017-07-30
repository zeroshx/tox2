angular.module('TOX2ADMINAPP').service('UserService', [
  '$q', 'CRUDFactory',
  function($q, CRUDFactory) {
    var __ = this;
    var _path = 'user';
    var _url = '/user';

    var _query = {
      page: 1,
      pageSize: 30,
      searchKeyword: '',
      searchFilter: '',
      site: '전체',
      distributor: '전체',
      userLevel: '전체',
      userState: '전체'
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


  }
]);
