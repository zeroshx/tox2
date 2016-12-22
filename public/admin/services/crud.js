var app = angular.module(ApplicationName);

app.factory('CRUDService', function($resource) {
    return {

        Create: function(path) {
            return $resource(path, {}, {
                run: {
                    method: 'POST'
                }
            });
        },

        Read: function(path) {
            return $resource(path, {}, {
                run: {
                    method: 'GET'
                }
            });
        },

        Update: function(path, id) {
            return $resource(path + '/:id', {
                id: id
            }, {
                run: {
                    method: 'PUT'
                }
            });
        },

        Delete: function(path, id) {
            return $resource(path + '/:id', {
                id: id
            }, {
                run: {
                    method: 'DELETE'
                }
            });
        }
    };
});
