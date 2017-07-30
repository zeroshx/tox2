/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var TOX2ADMINAPP = angular.module("TOX2ADMINAPP", [
  "ui.router",
  "ui.bootstrap",
  "ui.select",
  "oc.lazyLoad",
  "ngSanitize",
  "ngFileUpload",
  "ngAudio"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
TOX2ADMINAPP.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
  $ocLazyLoadProvider.config({
    // global configs go here
  });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
TOX2ADMINAPP.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  // $controllerProvider.allowGlobals();
}]);

TOX2ADMINAPP.config(['$provide', function Decorate($provide) {
  $provide.decorator('$locale', function($delegate) {
    var value = $delegate.DATETIME_FORMATS;
    value.SHORTDAY = [
      "일",
      "월",
      "화",
      "수",
      "목",
      "금",
      "토"
    ];
    return $delegate;
  });
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
TOX2ADMINAPP.factory('settings', ['$rootScope', function($rootScope) {
  // supported languages
  var settings = {
    layout: {
      pageSidebarClosed: false, // sidebar menu state
      pageContentWhite: true, // set page content layout
      pageBodySolid: false, // solid body color state
      pageAutoScrollOnLoad: 500 // auto scroll to top on page load
    },
    assetsPath: '../assets',
    globalPath: '../assets/global',
    layoutPath: '../assets/layouts/layout',
  };

  $rootScope.settings = settings;

  return settings;
}]);

/* Setup App Main Controller */
TOX2ADMINAPP.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.$on('$viewContentLoaded', function() {
    //App.initComponents(); // init core components
    //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
  });
}]);

/* Init global settings and run the app */
TOX2ADMINAPP.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {

  $rootScope.$state = $state; // state to be accessed from view
  $rootScope.$settings = settings; // state to be accessed from view

  // handle errors
  $rootScope.$on('$stateChangeError', function() {
    $state.go('error');
  });

  $rootScope.__SetUser = function(property, value) {
    if (angular.isObject($rootScope.__user)) {
      $rootScope.__user[property] = value;
      return;
    }
    $rootScope.__user = {};
    $rootScope.__user[property] = value;
  };

  $rootScope.__GetUser = function(property) {
    if (angular.isObject($rootScope.__user)) {
      return $rootScope.__user[property];
    }
    return undefined;
  };

  $rootScope.__DeleteUser = function(property) {
    if (property) {
      delete $rootScope.__user[property];
      return;
    }
    delete $rootScope.__user;
  };


  $rootScope.__SetLegacy = function(property, value) {
    if (angular.isObject($rootScope.__legacy)) {
      $rootScope.__legacy[property] = value;
      return;
    }
    $rootScope.__legacy = {};
    $rootScope.__legacy[property] = value;
  };

  $rootScope.__GetLegacy = function(property) {
    if (angular.isObject($rootScope.__legacy)) {
      return $rootScope.__legacy[property];
    }
    return undefined;
  };

  $rootScope.__DeleteLegacy = function(property) {
    if (property) {
      delete $rootScope.__legacy[property];
      return;
    }
    delete $rootScope.__legacy;
  };

  $rootScope.__SetLegacy('menu', {
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
    betting: {
      name: '배팅 관리',
      icon: 'icon-home',
      submenu: [{
        name: '실시간 배팅',
        path: 'betting-realtime',
        icon: 'icon-home'
      }, {
        name: '통계',
        path: 'betting-stat',
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
      }, {
        name: '레벨 설정',
        path: 'distributor-level',
        icon: 'icon-home'
      }]
    },
    config: {
      name: '설정',
      icon: 'icon-home',
      submenu: [{
        name: '운영 관리',
        path: 'config-manager',
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
  });

}]);
