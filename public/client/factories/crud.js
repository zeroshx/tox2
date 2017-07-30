TOX2APP.factory('CRUDFactory', ['$window', '$http', '$httpParamSerializer', '$state',
  function($window, $http, $httpParamSerializer, $state) {

  var baseUrl = '';

  return {

    CREATE: function(url, data, success, error, always) {
      var url = baseUrl + url;
      $http.post(url, data).then(
        function(response) {
          if(typeof always === 'function') always();
          success(response.data);
        },
        function(response) {
          console.error(response);
          if(typeof always === 'function') always();
          if(typeof error === 'function') error(response);
          $state.go('error');
        });
    },

    READ: function(url, query, success, error, always) {
      var url = baseUrl + url + '?' + $httpParamSerializer(query);
      $http.get(url).then(
        function(response) {
          if(typeof always === 'function') always();
          success(response.data);
        },
        function(response) {
          console.error(response);
          if(typeof always === 'function') always();
          if(typeof error === 'function') error(response);
          $state.go('error');
        });
    },

    UPDATE: function(url, data, success, error, always) {
      var url = baseUrl + url;
      $http.put(url, data).then(
        function(response) {
          if(typeof always === 'function') always();
          success(response.data);
        },
        function(response) {
          console.error(response);
          if(typeof always === 'function') always();
          if(typeof error === 'function') error(response);
          $state.go('error');
        });
    },

    DELETE: function(url, id, success, error, always) {
      var url = baseUrl + url + '/' + id;
      $http.delete(url).then(
        function(response) {
          if(typeof always === 'function') always();
          success(response.data);
        },
        function(response) {
          console.error(response);
          if(typeof always === 'function') always();
          if(typeof error === 'function') error(response);
          $state.go('error');
        });
    }
  };
}]);
