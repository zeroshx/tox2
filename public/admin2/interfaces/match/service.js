angular.module('TOX2ADMINAPP').service('MatchService', [
  '$q', 'CRUDFactory',
  function($q, CRUDFactory) {
    var __ = this;
    var _path = 'match';
    var _url = '/match';

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(23);
    tomorrow.setMinutes(59);
    tomorrow.setSeconds(59);

    var _query = {
      page: 1,
      pageSize: 30,
      searchKeyword: '',
      searchFilter: '',
      matchState: '전체',
      matchKind: '전체',
      date1: today,
      date2: tomorrow
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

    __.ChangeState = function(param, result, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _url + '/state',
        param,
        function(data) {
          if (data.failure) {
            result.push({
              id: param.id,
              state: param.state,
              msg: data.failure
            });
          }
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
