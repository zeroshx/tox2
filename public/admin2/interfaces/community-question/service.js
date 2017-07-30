angular.module('TOX2ADMINAPP').service('QuestionService', [
  '$q', 'CRUDFactory',
  function($q, CRUDFactory) {
    var __ = this;
    var _path = 'community-question';
    var _url = '/client/question';

    var _query = {
      page: 1,
      pageSize: 30,
      searchKeyword: '',
      searchFilter: '',
      site: '전체',
      questionState: '전체',
      questionStyle: '전체'
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

    __.One = function(query, success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _url + '/one',
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

    __.Postpone = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _url + '/postpone',
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

    __.Answer = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _url + '/answer',
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
