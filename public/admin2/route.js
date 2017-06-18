/* Setup Rounting For All Pages */
TOX2ADMINAPP.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // Redirect any unmatched url
  $urlRouterProvider.otherwise('/');

  function StateOptionWrapper(config) {

    var _commonResolve = {
      me: ['AuthService', function(AuthService) {
        return AuthService.Me();
      }],
      messages: ['AuthService', function(AuthService) {
        return AuthService.GetNewMessages();
      }]
    };

    for (key in _commonResolve) {
      config.resolve[key] = _commonResolve[key];
    }

    var _commonFiles = {
      preDeps: [
        '../assets/global/plugins/ladda/spin.min.js'
      ],
      postDeps: [
        '../assets/global/plugins/ladda/ladda-themeless.min.css',
        '../assets/global/plugins/ladda/ladda.min.js',
        '../assets/global/plugins/bootbox/bootbox.min.js',
        'directives/search-form/directive.js',
        'directives/pagination/directive.js',
        'directives/breadcrumb/directive.js',
        'directives/view-title/directive.js',
        'directives/form-control/directive.js',
        'directives/detail-view/directive.js',
        'directives/user-detail-view/directive.js',
        'services/common-list.js'
      ]
    };

    if(!config.resolve.preDeps) config.resolve.preDeps = [];
    for(i in _commonFiles.preDeps) {
      config.resolve.preDeps.push(_commonFiles.preDeps[i]);
    }

    if(!config.resolve.postDeps) config.resolve.postDeps = [];
    for(i in _commonFiles.postDeps) {
      config.resolve.postDeps.push(_commonFiles.postDeps[i]);
    }

    (function(preDeps) {
      config.resolve.preDeps = ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'TOX2ADMINAPP',
          insertBefore: '#ng_load_plugins_before',
          files: preDeps
        });
      }];
    })(config.resolve.preDeps);

    (function(postDeps) {
      config.resolve.postDeps = ['preDeps', '$ocLazyLoad', function(preDeps, $ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'TOX2ADMINAPP',
          insertBefore: '#ng_load_plugins_before',
          files: postDeps
        });
      }];
    })(config.resolve.postDeps);

    return config;
  }

  $stateProvider

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

    .state('error', StateOptionWrapper({
      url: "/error",
      templateUrl: "interfaces/error/view.html",
      data: {
        pageTitle: '오류'
      },
      controller: "ErrorCtrl",
      resolve: {
        postDeps: [
          'interfaces/error/controller.js'
        ]
      }
    }))

    .state('asset-deposit', StateOptionWrapper({
      url: "/asset/deposit",
      templateUrl: "interfaces/asset-deposit/view.html",
      data: {
        pageTitle: '입금관리'
      },
      controller: "DepositCtrl",
      resolve: {
        postDeps: [
          'interfaces/asset-deposit/service.js',
          'interfaces/asset-deposit/controller.js',
        ],
        init: ['postDeps', 'DepositService', function(postDeps, DepositService) {
          return DepositService.Init();
        }]
      }
    }))

    .state('asset-withdrawal', StateOptionWrapper({
      url: "/asset/withdrawal",
      templateUrl: "interfaces/asset-withdrawal/view.html",
      data: {
        pageTitle: '출금관리'
      },
      controller: "WithdrawalCtrl",
      resolve: {
        postDeps: [
          'interfaces/asset-withdrawal/service.js',
          'interfaces/asset-withdrawal/controller.js',
        ],
        init: ['postDeps', 'WithdrawalService', function(postDeps, WithdrawalService) {
          return WithdrawalService.Init();
        }]
      }
    }))

    .state('asset-report', StateOptionWrapper({
      url: "/asset/report",
      templateUrl: "interfaces/asset-report/view.html",
      data: {
        pageTitle: '입/출금 내역'
      },
      controller: "AssetReportCtrl",
      resolve: {
        postDeps: [
          'interfaces/asset-report/service.js',
          'interfaces/asset-report/controller.js',
        ],
        init: ['postDeps', 'AssetReportService', function(postDeps, AssetReportService) {
          return AssetReportService.Init();
        }]
      }
    }))

    .state('config-ipblock', StateOptionWrapper({
      url: "/config/ipblock",
      templateUrl: "interfaces/config-ipblock/view.html",
      data: {
        pageTitle: '아이피 관리'
      },
      controller: "IPBlockCtrl",
      resolve: {
        postDeps: [
          'interfaces/config-ipblock/service.js',
          'interfaces/config-ipblock/controller.js',
        ],
        init: ['postDeps', 'IPBlockService', function(postDeps, IPBlockService) {
          return IPBlockService.Init();
        }]
      }
    }))

    .state('config-blacklist', StateOptionWrapper({
      url: "/config/blacklist",
      templateUrl: "interfaces/config-blacklist/view.html",
      data: {
        pageTitle: '블랙리스트 관리'
      },
      controller: "BlacklistCtrl",
      resolve: {
        postDeps: [
          'interfaces/config-blacklist/service.js',
          'interfaces/config-blacklist/controller.js',
        ],
        init: ['postDeps', 'BlacklistService', function(postDeps, BlacklistService) {
          return BlacklistService.Init();
        }]
      }
    }))

    .state('site', StateOptionWrapper({
      url: "/site",
      templateUrl: "interfaces/site/view.html",
      data: {
        pageTitle: '사이트 기본설정'
      },
      controller: "SiteCtrl",
      resolve: {
        postDeps: [
          'interfaces/site/service.js',
          'interfaces/site/controller.js',
        ],
        init: ['postDeps', 'SiteService', function(postDeps, SiteService) {
          return SiteService.Init();
        }],
        levels: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Levels();
        }]
      }
    }))

    .state('site-betting', StateOptionWrapper({
      url: "/site/betting",
      templateUrl: "interfaces/site-betting/view.html",
      data: {
        pageTitle: '사이트 배팅 설정'
      },
      controller: "SiteBettingCtrl",
      resolve: {
        postDeps: [
          'interfaces/site-betting/service.js',
          'interfaces/site-betting/controller.js',
        ],
        init: ['postDeps', 'SiteBettingService', function(postDeps, SiteBettingService) {
          return SiteBettingService.Init();
        }],
        sites: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Sites();
        }],
        kinds: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.MatchKinds();
        }]
      }
    }))

    .state('site-level', StateOptionWrapper({
      url: "/site/level",
      templateUrl: "interfaces/site-level/view.html",
      data: {
        pageTitle: '사이트 레벨 설정'
      },
      controller: "SiteLevelCtrl",
      resolve: {
        postDeps: [
          'interfaces/site-level/service.js',
          'interfaces/site-level/controller.js',
        ],
        init: ['postDeps', 'SiteLevelService', function(postDeps, SiteLevelService) {
          return SiteLevelService.Init();
        }],
        sites: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Sites();
        }],
      }
    }))

    .state('distributor', StateOptionWrapper({
      url: "/distributor",
      templateUrl: "interfaces/distributor/view.html",
      data: {
        pageTitle: '총판 기본 설정'
      },
      controller: "DistributorCtrl",
      resolve: {
        postDeps: [
          'interfaces/distributor/service.js',
          'interfaces/distributor/controller.js',
        ],
        init: ['postDeps', 'DistributorService', function(postDeps, DistributorService) {
          return DistributorService.Init();
        }],
        sites: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Sites();
        }],
      }
    }))

    .state('community-message', StateOptionWrapper({
      url: "/community/message",
      templateUrl: "interfaces/community-message/view.html",
      data: {
        pageTitle: '메시지 관리'
      },
      controller: "MessageCtrl",
      resolve: {
        postDeps: [
          'interfaces/community-message/service.js',
          'interfaces/community-message/controller.js',
        ],
        init: ['postDeps', 'MessageService', function(postDeps, MessageService) {
          return MessageService.Init();
        }],
        sites: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Sites();
        }],
        distributors: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Distributors();
        }]
      }
    }))

    .state('community-question', StateOptionWrapper({
      url: "/community/question",
      templateUrl: "interfaces/community-question/view.html",
      data: {
        pageTitle: '고객센터'
      },
      controller: "QuestionCtrl",
      resolve: {
        postDeps: [
          'interfaces/community-question/service.js',
          'interfaces/community-question/controller.js',
        ],
        init: ['postDeps', 'QuestionService', function(postDeps, QuestionService) {
          return QuestionService.Init();
        }]
      }
    }))

    .state('community-board', StateOptionWrapper({
      url: "/community/board",
      templateUrl: "interfaces/community-board/view.html",
      data: {
        pageTitle: '게시판 관리'
      },
      controller: "BoardCtrl",
      resolve: {
        preDeps: [
          '../assets/global/plugins/bootstrap-summernote/summernote.css',
          '../assets/global/plugins/bootstrap-summernote/summernote.min.js',
        ],
        postDeps: [
          '../assets/global/plugins/angular-summernote/dist/angular-summernote.min.js',
          'interfaces/community-board/service.js',
          'interfaces/community-board/controller.js',
        ],
        init: ['postDeps', 'BoardService', function(postDeps, BoardService) {
          return BoardService.Init();
        }],
        sites: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Sites();
        }]
      }
    }))

    .state('todo', StateOptionWrapper({
      url: "/todo",
      templateUrl: "interfaces/todo/view.html",
      data: {
        pageTitle: 'TODO'
      },
      controller: "TodoCtrl",
      resolve: {
        postDeps: [
          'interfaces/todo/service.js',
          'interfaces/todo/controller.js',
        ],
        init: ['postDeps', 'TodoService', function(postDeps, TodoService) {
          return TodoService.Init();
        }]
      }
    }))

    .state('user', StateOptionWrapper({
      url: "/user",
      templateUrl: "interfaces/user/view.html",
      data: {
        pageTitle: '회원 기본 설정'
      },
      controller: "UserCtrl",
      resolve: {
        postDeps: [
          'interfaces/user/service.js',
          'interfaces/user/controller.js'
        ],
        init: ['postDeps', 'UserService', function(postDeps, UserService) {
          return UserService.Init();
        }],
        sites: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Sites();
        }],
        levels: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Levels();
        }],
        banks: ['postDeps', 'CommonListService', function(postDeps, CommonListService) {
          return CommonListService.Banks();
        }]
      }
    }))

    .state('user-history', StateOptionWrapper({
      url: "/user/history",
      templateUrl: "interfaces/user-history/view.html",
      data: {
        pageTitle: '접속 기록'
      },
      controller: "UserHistoryCtrl",
      resolve: {
        postDeps: [
          'interfaces/user-history/service.js',
          'interfaces/user-history/controller.js',
        ],
        init: ['postDeps', 'UserHistoryService', function(postDeps, UserHistoryService) {
          return UserHistoryService.Init();
        }]
      }
    }))

}]);
