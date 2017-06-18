angular.module('TOX2ADMINAPP')
  .directive('pagination', function() {

    var _basePath = 'directives/pagination/';
    var _pageStatusLength = 8;

    return {
      templateUrl: _basePath + 'view.html',
      restrict: 'AE',
      scope: {
        _query: '=queryBind',
        _lastPage: '=lastPageBind',
        _actionFunction: '=actionFunctionBind'
      },
      link: function(scope, element, attrs) {

        scope.$watch('_lastPage', function() {
          scope.CreatePageStatus();
        });

        scope.$watch('_query.page', function() {
          scope.CreatePageStatus();
        });

      },
      controller: ['$scope', 'CRUDFactory', 'PApi', function($scope, CRUDFactory, PApi) {

        $scope.CreatePageStatus = function() {

          if(isNaN($scope._query.page) || isNaN($scope._lastPage)) {
            PApi.Alert('리스트 페이지 이동 버튼을 구성하는데 실패하였습니다.');
            return;
          }

          $scope._pages = [];

          var where = $scope._query.page % _pageStatusLength;
          if (where === 0) {
            where = _pageStatusLength;
          }

          $scope._pages[where - 1] = {
            number: $scope._query.page,
            active: true
          };

          for (i = 0; i < (where - 1); i++) {
            $scope._pages[where - i - 2] = {
              number: $scope._query.page - i - 1,
              active: false
            };
          }

          for (i = 0; i < (_pageStatusLength - where); i++) {
            if ($scope._query.page + i + 1 <= $scope._lastPage) {
              $scope._pages[where + i] = {
                number: $scope._query.page + i + 1,
                active: false
              };
            }
          }

        };

        $scope._MovePage = function(page) {
          if($scope._query.page == page) return;
          $scope._query.page = Number(page);
          $scope._actionFunction();
        };

        $scope._NextPage = function() {
          var page = Number($scope._query.page);
          var lastPage = Number($scope._lastPage);
          var newPage = null;
          if (page + _pageStatusLength < lastPage) {
            newPage = page + _pageStatusLength;
          } else {
            newPage = lastPage;
          }
          if(newPage == $scope._query.page) return;
          $scope._query.page = newPage;
          $scope._actionFunction();
        };

        $scope._PreviousPage = function() {
          var page = Number($scope._query.page);
          var newPage = null;
          if ((page - _pageStatusLength) > 0) {
            newPage = page - _pageStatusLength;
          } else {
            newPage = 1;
          }
          if(newPage == $scope._query.page) return;
          $scope._query.page = newPage;
          $scope._actionFunction();
        };

        $scope._LastPage = function() {
          if($scope._query.page == $scope._lastPage) return;
          $scope._query.page = Number($scope._lastPage);
          $scope._actionFunction();
        };

        $scope._FirstPage = function() {
          if($scope._query.page == 1) return;
          $scope._query.page = 1;
          $scope._actionFunction();
        };

      }]
    };
  });
