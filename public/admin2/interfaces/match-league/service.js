angular.module('TOX2ADMINAPP').service('MatchLeagueService', [
  '$q', 'CRUDFactory', 'Upload',
  function($q, CRUDFactory, Upload) {
    var __ = this;
    var _path = 'match-league';
    var _url = '/match/league';

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

    __.Add = function (data, success, failure) {
      var defer = $q.defer();
      Upload.upload({
          url: _url,
          method: 'POST',
          data: data
      }).then(function(reps) {
        if (typeof success === 'function') return success(reps.data, defer);
        defer.resolve();
      },
      function(reps) {
        if (typeof failure === 'function') return failure(reps.statusText, defer);
        defer.reject();
      });
      return defer.promise;
    }

    __.Modify = function(data, success, failure) {
      var defer = $q.defer();
      Upload.upload({
          url: _url,
          method: 'PUT',
          data: data
      }).then(function(reps) {
        if (typeof success === 'function') return success(reps.data, defer);
        defer.resolve();
      },
      function(reps) {
        if (typeof failure === 'function') return failure(reps.statusText, defer);
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
