var app = angular.module('Site');
app.factory('SiteService', function($resource, $location, $q) {
  return {
    list: function() {
      return $resource('/site', {}, {
        run: {
          method: 'GET',
          isArray: true
        }
      });
    },
    single: function(id) {
      return $resource('/site/:siteId', {
        siteId: id
      }, {
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
    update: function() {
      return $resource('/site', {}, {
        run: {
          method: 'PUT'
        }
      });
    },
    delete: function(id) {
      return $resource('/site/:siteId', {
        siteId : id
      }, {
        run: {
          method: 'DELETE'
        }
      });
    }
  };
});
