angular.module('TOX2APP').service('MatchService', [
  '$q', '$window', 'CRUDFactory',
  function($q, $window, CRUDFactory) {

    var _target = {
      sport: {
        url: '/match/customer',
        query: {
          kindGroup: '스포츠'
        },
        breadcrumb: {
          path: 'match-sport',
          name: '스포츠',
          icon: 'icon-home'
        }
      },
      // knowhow: {
      //   path: '/client/board/customer',
      //   query: {
      //     page: 1,
      //     pageSize: 40,
      //     searchFilter: '',
      //     searchKeyword: '',
      //     sort: '노하우/공략'
      //   },
      //   breadcrumb: {
      //     path: 'board-knowhow',
      //     name: '노하우/공략',ㄴ
      //     icon: 'icon-home'
      //   }
      // }
    };

    var _url = '';

    this.Init = function(kindGroup) {
      _url = _target[kindGroup].path;
      return this.List(_target[kindGroup].query,
        function(data, defer) {
          defer.resolve({
            data: data,
            query: _target[kindGroup].query,
            path: _target[kindGroup].path,
            breadcrumb: _target[kindGroup].breadcrumb
          });
        });
    };

    this.List = function(query, success, failure) {
      var defer = $q.defer();
      CRUDFactory.READ(
        _url,
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

  }
]);
