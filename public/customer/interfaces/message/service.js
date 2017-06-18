angular.module('TOX2APP').service('MessageService', [
  '$q', '$window', 'CRUDFactory',
  function($q, $window, CRUDFactory) {

    var _path = '/client/message/customer';
    var _query = {
      page: 1,
      pageSize: 20,
      type: '수신',
      check: '전체'
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

    this.Count = function() {
      return this.NewCount(
        function(data, defer) {
          defer.resolve({
            data: data
          });
        });
    };

    this.List = function(query, success, failure) {
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

    this.ReadMessage = function(id, success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _path + '/one/' + id,
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

    this.SendMessage = function(data, success, failure) {
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

    this.NewCount = function(success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _path + '/new-count',
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
  }
]);
