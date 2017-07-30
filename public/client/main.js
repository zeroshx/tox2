/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var TOX2APP = angular.module("TOX2APP", [
  "ui.router",
  "ui.bootstrap",
  "ui.select",
  "oc.lazyLoad",
  "ngSanitize",
  "ngFileUpload",
  "ngAudio"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
TOX2APP.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
  $ocLazyLoadProvider.config({
    // global configs go here
  });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
TOX2APP.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  // $controllerProvider.allowGlobals();
}]);

TOX2APP.config(['$provide', function Decorate($provide) {
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
TOX2APP.factory('settings', ['$rootScope', function($rootScope) {
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
TOX2APP.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.$on('$viewContentLoaded', function() {
    //App.initComponents(); // init core components
    //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
  });
}]);

/* Init global settings and run the app */
TOX2APP.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {

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
    game: {
      name: '게임',
      icon: 'icon-home',
      submenu: [{
        name: '스포츠',
        path: 'game-sport',
        icon: 'icon-home'
      }, {
        name: '이벤트',
        path: 'game-event',
        icon: 'icon-home'
      }]
    },
    distributor: {
      name: '총판',
      icon: 'icon-home',
      submenu: [{
        name: '가입하기',
        path: 'distributor-signup',
        icon: 'icon-home'
      }, {
        name: '생성하기',
        path: 'distributor-make',
        icon: 'icon-home'
      }]
    },
    community: {
      name: '커뮤니티',
      icon: 'icon-home',
      submenu: [{
        name: '자유게시판',
        path: 'community-freeboard',
        icon: 'icon-home'
      }, {
        name: '노하우/공략',
        path: 'community-knowhow',
        icon: 'icon-home'
      }, {
        name: '건의/오류제보',
        path: 'community-report',
        icon: 'icon-home'
      }]
    },
    stat: {
      name: '통계',
      path: 'stat',
      icon: 'icon-home'
    },
    ranking: {
      name: '랭킹',
      path: 'ranking',
      icon: 'icon-home'
    },
    service: {
      name: '고객센터',
      icon: 'icon-home',
      submenu: [{
        name: '입금 신청',
        path: 'service-deposit',
        icon: 'icon-home'
      }, {
        name: '출금 신청',
        path: 'service-withdrawal',
        icon: 'icon-home'
      }, {
        name: '1:1 문의',
        path: 'service-question',
        icon: 'icon-home'
      }]
    },
    account: {
      name: '계정',
      icon: 'icon-home',
      submenu: [{
        name: '기본 정보',
        path: 'account-info',
        icon: 'icon-home'
      }, {
        name: '쪽지함',
        path: 'account-message',
        icon: 'icon-home'
      }]
    }
  });



}]);
