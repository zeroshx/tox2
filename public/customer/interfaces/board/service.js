angular.module('TOX2APP').service('BoardService', [
  '$q', '$window', 'CRUDFactory',
  function($q, $window, CRUDFactory) {

    var _target = {
      free: {
        path: '/client/board/customer',
        query: {
          page: 1,
          pageSize: 40,
          searchFilter: '',
          searchKeyword: '',
          sort: '자유게시판'
        },
        breadcrumb: {
          path: 'board-free',
          name: '자유게시판',
          icon: 'icon-home'
        }
      },
      knowhow: {
        path: '/client/board/customer',
        query: {
          page: 1,
          pageSize: 40,
          searchFilter: '',
          searchKeyword: '',
          sort: '노하우/공략'
        },
        breadcrumb: {
          path: 'board-knowhow',
          name: '노하우/공략',
          icon: 'icon-home'
        }
      },
      suggestion: {
        path: '/client/board/customer',
        query: {
          page: 1,
          pageSize: 40,
          searchFilter: '',
          searchKeyword: '',
          sort: '건의/오류제보'
        },
        breadcrumb: {
          path: 'board-suggestion',
          name: '건의/오류제보',
          icon: 'icon-home'
        }
      },
      distributor: {
        path: '/client/board/distributor',
        query: {
          page: 1,
          pageSize: 40,
          searchFilter: '',
          searchKeyword: '',
          sort: '총판게시판'
        },
        breadcrumb: {
          path: 'board-distributor',
          name: '총판게시판',
          icon: 'icon-home'
        }
      }
    };

    var _path = '';

    this.Init = function(sort) {
      _path = _target[sort].path;
      return this.List(_target[sort].query,
        function(data, defer) {
          defer.resolve({
            data: data,
            query: _target[sort].query,
            path: _target[sort].path,
            breadcrumb: _target[sort].breadcrumb
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

    this.GetWriting = function(id, success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _path + '/' + id, {},
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

    this.CreateWriting = function(data, success, failure) {
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

    this.CreateReply = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.CREATE(
        _path + '/reply',
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

    this.Opinion = function(data, success, failure) {
      var defer = $q.defer();
      CRUDFactory.UPDATE(
        _path + '/opinion',
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
