var _app = angular.module(ApplicationName);

_app.controller('HeaderCtrl', function($scope, $rootScope, $location, AuthService) {

    $scope.logout = function() {
        AuthService.logout().run(function(res) {
            $rootScope.currentUser = null;
            $rootScope.session = false;
            $location.path('/login');
        }, function(err) {});
    };
});

_app.controller('NavCtrl', function($scope, $rootScope, $location) {

});

_app.controller('AsideCtrl', function($scope) {

});

_app.controller('SectionCtrl', function($scope) {
});

_app.controller('FooterCtrl', function($scope) {
});
