var _app = angular.module(ApplicationName);

_app.controller('HeaderCtrl', function($rootScope, $scope, $filter, AuthService, CRUDService) {

  $scope.me = null;

  $scope.GetUserData = function() {
    AuthService.Me().run({}, function(res) {
      if (res.hasOwnProperty('failure')) {
        console.log(res.failure);
      } else {
        $scope.me = res;
        $scope.GetUserMessageCount();
        $scope.RenderData();
      }
    }, function(err) {
      console.log('사용자 정보 로딩 실패.');
    });
  };

  $scope.GetUserMessageCount = function() {
    CRUDService.Read('/client/message/new').run({
      nick: $scope.me.nick
    }, function(res) {
      $scope.me.messageCount = res.count;
    }, function(err) {
      alert('사용자 정보를 로드하는데 실패하였습니다. 새로고침(F5) 후에 재시도바랍니다.');
    });
  };

  $scope.RenderData = function() {
    $scope.me.cashCurrency = $filter('number')($scope.me.cash);
    $scope.me.moneyCurrency = $filter('number')($scope.me.money);
    $scope.me.pointCurrency = $filter('number')($scope.me.point);
  };

  $scope.GetUserData();
});
