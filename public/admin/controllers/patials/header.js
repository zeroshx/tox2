var _app = angular.module(ApplicationName);

_app.controller('HeaderCtrl', function($rootScope, $scope, AuthService) {

  $rootScope.mainmenu = [];

  //메뉴 : 입/출금
  $rootScope.mainmenu.push({
    name: '재정',
    submenu: [{
      name: '입금 관리',
      path: '/asset/deposit'
    }, {
      name: '출금 관리',
      path: '/asset/withdrawal'
    }, {
      name: '자산 변동 내역',
      path: '/asset/report'
    }, {
      name: '입/출금 통계',
      path: '/asset/stat'
    }]
  });

  $rootScope.mainmenu.push({
    name: '매치',
    submenu: [{
      name: '매치 관리',
      path: '/match'
    }, {
      name: '종목 설정',
      path: '/match/kind'
    }, {
      name: '리그 설정',
      path: '/match/league'
    }, {
      name: '실시간 배팅 관리',
      path: '/match/bet'
    }, {
      name: '배팅 통계',
      path: '/match/stat'
    }]
  });

  $rootScope.mainmenu.push({
    name: '회원',
    submenu: [{
      name: '회원 관리',
      path: '/user'
    }, {
      name: '접속기록',
      path: '/user/history'
    }, {
      name: '회원 통계',
      path: '/user/stat'
    }]
  });

  $rootScope.mainmenu.push({
    name: '고객센터',
    submenu: [{
      name: '고객문의',
      path: '/client/question'
    }, {
      name: '게시판 관리',
      path: '/client/board'
    }, {
      name: '메시지 관리',
      path: '/client/message'
    }]
  });

  $rootScope.mainmenu.push({
    name: '사이트',
    submenu: [{
      name: '사이트 관리',
      path: '/site'
    }, {
      name: '배팅 설정',
      path: '/site/config'
    }, {
      name: '레벨 설정',
      path: '/site/level'
    }]
  });

  $rootScope.mainmenu.push({
    name: '총판',
    submenu: [{
      name: '총판 관리',
      path: '/distributor'
    }, {
      name: '총판 회원 관리',
      path: '/distributor/member'
    }]
  });

  $rootScope.mainmenu.push({
    name: '설정',
    submenu: [{
      name: '아이피(IP) 관리',
      path: '/config/ipblock'
    }, {
      name: '블랙리스트',
      path: '/config/blacklist'
    }, {
      name: '관리자',
      path: '/config/manager'
    }]
  });

  $scope.me = null;
  AuthService.Me().run({}, function(res) {
    if(res.hasOwnProperty('failure')) {
      console.log(res.failure);
    } else {
      $scope.me = res;
    }
  }, function(err) {
    console.log('사용자 정보 로딩 실패.');
  });

});
