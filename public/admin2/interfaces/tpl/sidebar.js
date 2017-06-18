/* Setup Layout Part - Sidebar */
angular.module("TOX2ADMINAPP")
  .controller('SidebarController', ['$state', '$scope', '$rootScope', function($state, $scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {
      Layout.initSidebar($state); // init sidebar
    });

    $scope.menu = {
      home: {
        name: '홈',
        path: 'home',
        icon: 'icon-home'
      },
      asset: {
        name: '입/출금 관리',
        icon: 'icon-home',
        submenu: [{
          name: '입금',
          path: 'asset-deposit',
          icon: 'icon-home'
        }, {
          name: '출금',
          path: 'asset-withdrawal',
          icon: 'icon-home'
        }, {
          name: '게임머니 내역',
          path: 'asset-report',
          icon: 'icon-home'
        }, {
          name: '통계',
          path: 'asset-stat',
          icon: 'icon-home'
        }]
      },
      match: {
        name: '매치 관리',
        icon: 'icon-home',
        submenu: [{
          name: '기본 설정',
          path: 'match',
          icon: 'icon-home'
        }, {
          name: '종목',
          path: 'match-kind',
          icon: 'icon-home'
        }, {
          name: '리그',
          path: 'match-league',
          icon: 'icon-home'
        }, {
          name: '배팅',
          path: 'match-betting',
          icon: 'icon-home'
        }, {
          name: '배팅 통계',
          path: 'match-betting-stat',
          icon: 'icon-home'
        }]
      },
      user: {
        name: '회원 관리',
        icon: 'icon-home',
        submenu: [{
          name: '기본 설정',
          path: 'user',
          icon: 'icon-home'
        }, {
          name: '접속 기록',
          path: 'user-history',
          icon: 'icon-home'
        }, {
          name: '통계',
          path: 'user-stat',
          icon: 'icon-home'
        }]
      },
      community: {
        name: '커뮤니티 관리',
        icon: 'icon-home',
        submenu: [{
          name: '고객Q&A',
          path: 'community-question',
          icon: 'icon-home'
        }, {
          name: '게시판 관리',
          path: 'community-board',
          icon: 'icon-home'
        }, {
          name: '메시지 관리',
          path: 'community-message',
          icon: 'icon-home'
        }]
      },
      site: {
        name: '사이트 관리',
        icon: 'icon-home',
        submenu: [{
          name: '기본 설정',
          path: 'site',
          icon: 'icon-home'
        }, {
          name: '배팅 설정',
          path: 'site-betting',
          icon: 'icon-home'
        }, {
          name: '레벨 설정',
          path: 'site-level',
          icon: 'icon-home'
        }]
      },
      distributor: {
        name: '총판 관리',
        icon: 'icon-home',
        submenu: [{
          name: '기본 설정',
          path: 'distributor',
          icon: 'icon-home'
        }]
      },
      config: {
        name: '설정',
        icon: 'icon-home',
        submenu: [{
          name: '운영 관리',
          path: 'config',
          icon: 'icon-home'
        }, {
          name: '아이피 관리',
          path: 'config-ipblock',
          icon: 'icon-home'
        }, {
          name: '블랙리스트 관리',
          path: 'config-blacklist',
          icon: 'icon-home'
        }]
      },
      todo: {
        name: 'Todo',
        icon: 'icon-home',
        path: 'todo'
      }
    };

    $rootScope.__SetLegacy('menu', $scope.menu);

  }]);
