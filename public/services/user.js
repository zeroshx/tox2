var app = angular.module('User');
app.factory('UserService', function($resource, $location, $q) {
  return {
    list: function() {
      return $resource('/user', {}, {
        run: {
          method: 'GET',
          isArray: true
        }
      });
    },
    single: function(id) {
      return $resource('/user/:userId', {
        userId: id
      }, {
        run: {
          method: 'GET'
        }
      });
    },
    create: function() {
      return $resource('/user', {}, {
        run: {
          method: 'POST'
        }
      });
    },
    update: function() {
      return $resource('/user', {}, {
        run: {
          method: 'PUT'
        }
      });
    },
    delete: function(id) {
      return $resource('/user/:userId', {
        userId : id
      }, {
        run: {
          method: 'DELETE'
        }
      });
    }
  };
});
