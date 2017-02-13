var app = angular.module(ApplicationName);

app.factory('CRUDService', function($resource) {
  var url = '/api';
  return {

    Create: function(path) {
      return $resource(url + path, {}, {
        run: {
          method: 'POST'
        }
      });
    },

    Read: function(path) {
      return $resource(url + path, {}, {
        run: {
          method: 'GET'
        }
      });
    },

    Update: function(path, id) {
      return $resource(url + path + '/:id', {
        id: id
      }, {
        run: {
          method: 'PUT'
        }
      });
    },

    Delete: function(path, id) {
      return $resource(url + path + '/:id', {
        id: id
      }, {
        run: {
          method: 'DELETE'
        }
      });
    }
  };
});
