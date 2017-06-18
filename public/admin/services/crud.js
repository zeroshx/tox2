angular.module('TOX2ADMINAPP')
  .factory('CRUDService', function($resource) {
  var url = '/api';
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
