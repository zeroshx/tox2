TOX2ADMINAPP.factory('CRUDFactory', ['$window', '$http', '$httpParamSerializer', 'PApi', function($window, $http, $httpParamSerializer, PApi) {
  var baseUrl = '';
  return {

    READ: function(url, query, success, error, always) {
      var url = baseUrl + url + '?' + $httpParamSerializer(query);
      $http.get(url).then(
        function(response) {
          if(typeof always === 'function') always();
          success(response.data);
        },
        function(response) {
          if(typeof always === 'function') always();
          if(typeof error === 'function') {
            error(response);
            $window.location = '/';
          }
          else PApi.Alert('일시적인 문제가 발생하였습니다. 로그인 페이지로 이동합니다.', function () {
            $window.location = '/';
          });
        });
    },

    CREATE: function(url, data, success, error, always) {
      var url = baseUrl + url;
      $http.post(url, data).then(
        function(response) {
          if(typeof always === 'function') always();
          success(response.data);
        },
        function(response) {
          if(typeof always === 'function') always();
          if(typeof error === 'function') {
            error(response);
            $window.location = '/';
          }
          else PApi.Alert('일시적인 문제가 발생하였습니다. 로그인 페이지로 이동합니다.', function () {
            $window.location = '/';
          });
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
          if(typeof always === 'function') always();
          if(typeof error === 'function') {
            error(response);
            $window.location = '/';
          }
          else PApi.Alert('일시적인 문제가 발생하였습니다. 로그인 페이지로 이동합니다.', function () {
            $window.location = '/';
          });
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
          if(typeof always === 'function') always();
          if(typeof error === 'function') {
            error(response);
            $window.location = '/';
          }
          else PApi.Alert('일시적인 문제가 발생하였습니다. 로그인 페이지로 이동합니다.', function () {
            $window.location = '/';
          });
        });
    }
  };
}]);
