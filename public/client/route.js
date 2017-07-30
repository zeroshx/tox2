/* Setup Rounting For All Pages */
TOX2APP.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // Redirect any unmatched url
  $urlRouterProvider.otherwise('/');

  function StateOptionWrapper(config) {

    var _commonResolve = {
      auth: ['AuthService', function(AuthService) {
        return AuthService.Auth();
      }]
    };

    for (key in _commonResolve) {
      config.resolve[key] = _commonResolve[key];
    }

    var _commonFiles = {
      preDeps: [

      ],
      postDeps: [
        '../assets/global/plugins/bootbox/bootbox.min.js'
      ]
    };

    if (!config.resolve.preDeps) config.resolve.preDeps = [];
    for (var i = 0; i < _commonFiles.preDeps.length; i++) {
      config.resolve.preDeps.push(_commonFiles.preDeps[i]);
    }

    if (!config.resolve.postDeps) config.resolve.postDeps = [];
    for (var i = 0; i < _commonFiles.postDeps.length; i++) {
      config.resolve.postDeps.push(_commonFiles.postDeps[i]);
    }

    (function(preDeps) {
      config.resolve.preDeps = ['auth', '$ocLazyLoad', function(auth, $ocLazyLoad) {
        if (preDeps.length > 0) {
          return $ocLazyLoad.load({
            insertBefore: '#ng_load_plugins_before',
            files: preDeps
          });
        }
        return true;
      }];
    })(config.resolve.preDeps);

    (function(postDeps) {
      config.resolve.postDeps = ['preDeps', '$ocLazyLoad', function(preDeps, $ocLazyLoad) {
        if (postDeps.length > 0) {
          return $ocLazyLoad.load({
            insertBefore: '#ng_load_plugins_before',
            files: postDeps
          });
        }
        return true;
      }];
    })(config.resolve.postDeps);

    return config;
  }

  $stateProvider.state('error', {
      url: "/error",
      templateUrl: "interfaces/error/view.html",
      data: {
        pageTitle: '오류'
      },
      controller: "ErrorCtrl",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
            files: [
              'interfaces/error/controller.js'
            ]
          });
        }]
      }
    })

    // Dashboard
    .state('home', StateOptionWrapper({
      url: "/",
      templateUrl: "interfaces/home/view.html",
      data: {
        pageTitle: '홈'
      },
      controller: "HomeCtrl",
      resolve: {
        postDeps: [
          'interfaces/home/controller.js'
        ]
      }
    }))

    .state('game-sport', StateOptionWrapper({
      url: "/game/sport",
      templateUrl: "interfaces/game-sport/view.html",
      data: {
        pageTitle: '스포츠 게임'
      },
      controller: "GameSportCtrl",
      resolve: {
        postDeps: [
          'interfaces/game-sport/service.js',
          'interfaces/game-sport/controller.js'
        ]
      }
    }))

    .state('game-event', StateOptionWrapper({
      url: "/game/event",
      templateUrl: "interfaces/game-event/view.html",
      data: {
        pageTitle: '스포츠 게임'
      },
      controller: "GameEventCtrl",
      resolve: {
        postDeps: [
          'interfaces/game-event/service.js',
          'interfaces/game-event/controller.js'
        ]
      }
    }))

    .state('distributor-signup', StateOptionWrapper({
      url: "/distributor/signup",
      templateUrl: "interfaces/distributor-signup/view.html",
      data: {
        pageTitle: '총판 가입'
      },
      controller: "DistributorSignupCtrl",
      resolve: {
        postDeps: [
          'interfaces/distributor-signup/service.js',
          'interfaces/distributor-signup/controller.js'
        ]
      }
    }))

    .state('distributor-make', StateOptionWrapper({
      url: "/distributor/make",
      templateUrl: "interfaces/distributor-make/view.html",
      data: {
        pageTitle: '총판 생성'
      },
      controller: "DistributorMakeCtrl",
      resolve: {
        postDeps: [
          'interfaces/distributor-make/service.js',
          'interfaces/distributor-make/controller.js'
        ]
      }
    }))

    .state('community-freeboard', StateOptionWrapper({
      url: "/community/freeboard",
      templateUrl: "interfaces/community-freeboard/view.html",
      data: {
        pageTitle: '자유게시판'
      },
      controller: "CommunityFreeboardCtrl",
      resolve: {
        postDeps: [
          'interfaces/community-freeboard/service.js',
          'interfaces/community-freeboard/controller.js'
        ]
      }
    }))

    .state('community-knowhow', StateOptionWrapper({
      url: "/community/knowhow",
      templateUrl: "interfaces/community-knowhow/view.html",
      data: {
        pageTitle: '노하우/공략 게시판'
      },
      controller: "CommunityKnowhowCtrl",
      resolve: {
        postDeps: [
          'interfaces/community-knowhow/service.js',
          'interfaces/community-knowhow/controller.js'
        ]
      }
    }))

    .state('community-report', StateOptionWrapper({
      url: "/community/report",
      templateUrl: "interfaces/community-report/view.html",
      data: {
        pageTitle: '건의/오류제보 게시판'
      },
      controller: "CommunityReportCtrl",
      resolve: {
        postDeps: [
          'interfaces/community-report/service.js',
          'interfaces/community-report/controller.js'
        ]
      }
    }))

    .state('stat', StateOptionWrapper({
      url: "/stat",
      templateUrl: "interfaces/stat/view.html",
      data: {
        pageTitle: '통계'
      },
      controller: "StatCtrl",
      resolve: {
        postDeps: [
          'interfaces/stat/service.js',
          'interfaces/stat/controller.js'
        ]
      }
    }))

    .state('ranking', StateOptionWrapper({
      url: "/ranking",
      templateUrl: "interfaces/ranking/view.html",
      data: {
        pageTitle: '통계'
      },
      controller: "RankingCtrl",
      resolve: {
        postDeps: [
          'interfaces/ranking/service.js',
          'interfaces/ranking/controller.js'
        ]
      }
    }))

    .state('service-deposit', StateOptionWrapper({
      url: "/service/deposit",
      templateUrl: "interfaces/service-deposit/view.html",
      data: {
        pageTitle: '입금 신청'
      },
      controller: "ServiceDepositCtrl",
      resolve: {
        postDeps: [
          'interfaces/service-deposit/service.js',
          'interfaces/service-deposit/controller.js'
        ]
      }
    }))

    .state('service-withdrawal', StateOptionWrapper({
      url: "/service/withdrawal",
      templateUrl: "interfaces/service-withdrawal/view.html",
      data: {
        pageTitle: '출금 신청'
      },
      controller: "ServiceWithdrawalCtrl",
      resolve: {
        postDeps: [
          'interfaces/service-withdrawal/service.js',
          'interfaces/service-withdrawal/controller.js'
        ]
      }
    }))

    .state('service-question', StateOptionWrapper({
      url: "/service/question",
      templateUrl: "interfaces/service-question/view.html",
      data: {
        pageTitle: '1:1 문의'
      },
      controller: "ServiceQuestionCtrl",
      resolve: {
        postDeps: [
          'interfaces/service-question/service.js',
          'interfaces/service-question/controller.js'
        ]
      }
    }))

    .state('account-info', StateOptionWrapper({
      url: "/account/info",
      templateUrl: "interfaces/account-info/view.html",
      data: {
        pageTitle: '기본 정보'
      },
      controller: "AccountInfoCtrl",
      resolve: {
        postDeps: [
          'interfaces/account-info/service.js',
          'interfaces/account-info/controller.js'
        ]
      }
    }))

    .state('account-message', StateOptionWrapper({
      url: "/account/message",
      templateUrl: "interfaces/account-message/view.html",
      data: {
        pageTitle: '쪽지함'
      },
      controller: "AccountMessageCtrl",
      resolve: {
        postDeps: [
          'interfaces/account-message/service.js',
          'interfaces/account-message/controller.js'
        ]
      }
    }))



}]);
