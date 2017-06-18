angular.module('TOX2ADMINAPP')
  .directive('searchForm', function() {

    var _basePath = 'directives/search-form/';

    return {
      templateUrl: _basePath + 'view.html',
      restrict: 'AE',
      scope: {
        _query: '=queryBind',
        _searchFilter: '=searchFilterBind',
        _actionFunction: '=actionFunctionBind'
      },
      link: function(scope, element, attrs) {

      },
      controller: ['$scope', 'CRUDFactory', function($scope, CRUDFactory) {

        $scope._queryFilterExpand = true;

        $scope.ShowQueryFilter = function() {
          $scope._queryFilterExpand = !$scope._queryFilterExpand;
        };

        Ladda.bind('button.ladda-button');

        $scope._queryFilterCount = 0;
        $scope._queryFilter = {};
        for (qry in $scope._query) {
          if (qry === 'page' || qry === 'pageSize' || qry === 'searchFilter' || qry === 'searchKeyword') continue;
          $scope._queryFilter[qry] = {
            name: qry,
            toggle: true,
            list: null
          };
          $scope._queryFilterCount++;
        }

        $scope.GetList = function(name, url) {
          var target = 'btn-' + name;
          if ($scope._queryFilter[name].list) return;

          var lb = Ladda.create(document.getElementById(target));
          lb.start();

          CRUDFactory.READ(
            url, {},
            function(data) {
              lb.stop();
              $scope._queryFilter[name].list = data.docs;
              $('#' + target).dropdown('toggle');
            }
          );
        };

        $scope.ChangeListSize = function() {
          $scope._actionFunction();
        };

        $scope.Search = function() {
          $scope._actionFunction();
        };

      }]
    };
  });
