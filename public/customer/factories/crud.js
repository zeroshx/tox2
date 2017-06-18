TOX2APP.factory('CRUDFactory', ['$http', '$httpParamSerializer', function($http, $httpParamSerializer) {
  var basePath = '';
  return {

    READ: function(path, query, success, error) {
      var url = basePath + path + '?' + $httpParamSerializer(query);
      $http.get(url).then(
        function(response) {
          success(response.data);
        },
        function(response) {
          console.log(response);
          error(response);
        });
    },

    CREATE: function(path, data, success, error) {
      var url = basePath + path;
      $http.post(url, data).then(
        function(response) {
          success(response.data);
        },
        function(response) {
          bootbox.alert('본문 내용이 너무 커서 등록할 수 없습니다.');
          error(response);
        });
    },

    UPDATE: function(path, data, success, error) {
      var url = basePath + path;
      $http.put(url, data).then(
        function(response) {
          success(response.data);
        },
        function(response) {
          console.log(response);
          error(response);
        });
    },

    DELETE: function(path, id, success, error) {
      var url = basePath + path + '/' + id;
      $http.delete(url).then(
        function(response) {
          success(response.data);
        },
        function(response) {
          console.log(response);
          error(response);
        });
    }
  };
}]);
