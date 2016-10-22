var app = angular.module('Distributor');
app.factory('DistributorService', function($resource, $location, $q) {
    return {
        list: function() {
            return $resource('/distributor', {}, {
                run: {
                    method: 'GET',
                    isArray: true
                }
            });
        },
        single: function(id) {
            return $resource('/distributor/:distId', {
                distId: id
            }, {
                run: {
                    method: 'GET'
                }
            });
        },
        create: function() {
            return $resource('/distributor', {}, {
                run: {
                    method: 'POST'
                }
            });
        },
        update: function() {
            return $resource('/distributor', {}, {
                run: {
                    method: 'PUT'
                }
            });
        },
        delete: function(id) {
            return $resource('/distributor/:distId', {
                distId: id
            }, {
                run: {
                    method: 'DELETE'
                }
            });
        }
    };
});
