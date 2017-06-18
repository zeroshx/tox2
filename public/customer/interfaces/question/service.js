angular.module('TOX2APP').service('QuestionService', [
  '$q', '$window', 'CRUDFactory',
  function($q, $window, CRUDFactory) {

    var _path = '/client/question/customer';
    var _query = {
      page: 1,
      pageSize: 20,
      state: '전체'
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

    this.GetQuestion = function(id, success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _path + '/' + id,
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

    this.SendQuestion = function(data, success, failure) {
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
