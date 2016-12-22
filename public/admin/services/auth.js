var app = angular.module(ApplicationName);
app.factory('AuthService', function($resource, $location, $q) {
    return {

        isAlive: function() {
            return $resource('/auth/alive', {}, {
                run: {
                    method: 'GET'
                }
            });
        },

        isAliveQ: function() {
            var defer = $q.defer();
            $resource('/auth/alive').get(
                function(res) {
                    defer.resolve();
                },
                function(err) {
                    defer.reject();
                    $location.path('/login');
                });
            return defer.promise;
        },

        Me: function() {
            return $resource('/user/me', {}, {
                run: {
                    method: 'GET'
                }
            });
        }
    };
});
