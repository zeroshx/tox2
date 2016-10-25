var app = angular.module('Site');
app.factory('SiteService', function($resource, $location, $q) {
    return {
        // one: function(id) {
        //     return $resource('/site/:siteId', {
        //         siteId: id
        //     }, {
        //         run: {
        //             method: 'GET'
        //         }
        //     });
        // },
        list: function() {
            return $resource('/site', {}, {
                run: {
                    method: 'GET'
                }
            });
        },
        create: function() {
            return $resource('/site', {}, {
                run: {
                    method: 'POST'
                }
            });
        },
        update: function(id) {
            return $resource('/site/:siteId', {
                siteId: id
            }, {
                run: {
                    method: 'PUT'
                }
            });
        },
        delete: function(id) {
            return $resource('/site/:siteId', {
                siteId: id
            }, {
                run: {
                    method: 'DELETE'
                }
            });
        }
    };
});
