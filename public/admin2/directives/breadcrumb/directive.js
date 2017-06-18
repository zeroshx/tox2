angular.module('TOX2ADMINAPP')
  .directive('breadcrumb', function() {

    var _basePath = 'directives/breadcrumb/';

    return {
      templateUrl: _basePath + 'view.html',
      restrict: 'AE',
      scope: {
        _path: '=currentPathBind'
      },
      link: function(scope, element, attrs) {

      },
      controller: ['$rootScope', '$scope', 'CRUDFactory', function($rootScope, $scope, CRUDFactory) {

        $scope._breadcrumb = [];

        var menu = $rootScope.__GetLegacy('menu');
        for(i in menu) {
          if(menu[i].submenu) {
            for(j in menu[i].submenu) {
              if(menu[i].submenu[j].path === $scope._path) {
                $scope._breadcrumb.push({
                  icon: menu[i].icon,
                  path: menu[i].path,
                  name: menu[i].name
                });
                $scope._breadcrumb.push({
                  icon: menu[i].submenu[j].icon,
                  path: menu[i].submenu[j].path,
                  name: menu[i].submenu[j].name
                });
              }
            }
          } else {
            if(menu[i].path === $scope._path) {
              $scope._breadcrumb.push({
                icon: menu[i].icon,
                path: menu[i].path,
                name: menu[i].name
              });
            }
          }
        }

      }]
    };
  });
