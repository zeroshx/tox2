/* Setup Rounting For All Pages */
angular.module('TOX2APP')
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/");

    var ctrlPath = 'controllers/';

    var _commonResolve = {
      me: ['UserService', function(UserService) {
        return UserService.Me();
      }],
      messages: ['UserService', function(UserService) {
        return UserService.GetNewMessages();
      }]
    };

    function StateOptionWrapper(config) {
      for (key in _commonResolve) {
        config.resolve[key] = _commonResolve[key];
      }
      return config;
    }

    $stateProvider

      .state('error', {
        url: "/error",
        templateUrl: "interfaces/error/view.html",
        data: {
          pageTitle: '오류'
        },
        controller: "ErrorCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              // insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
          pageTitle: 'Home'
        },
        controller: "HomeCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              // insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                'interfaces/home/controller.js'
              ]
            });
          }]
        }
      }))

      // Dashboard
      .state('deposit', StateOptionWrapper({
        url: "/deposit",
        templateUrl: "interfaces/deposit/view.html",
        data: {
          pageTitle: '입금 신청'
        },
        controller: "DepositCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/pages/css/profile.min.css',
                '../assets/global/plugins/nouislider/nouislider.min.css',
                '../assets/global/plugins/nouislider/nouislider.min.js',
                '../assets/global/plugins/nouislider/wNumb.min.js',
                '../assets/global/plugins/bootbox/bootbox.min.js',

                'interfaces/deposit/service.js',
                'interfaces/deposit/controller.js'
              ]
            });
          }],
          init: ['deps', 'DepositService', function(deps, DepositService) {
            return DepositService.Init();
          }]
        }
      }))

      // Dashboard
      .state('withdrawal', StateOptionWrapper({
        url: "/withdrawal",
        templateUrl: "interfaces/withdrawal/view.html",
        data: {
          pageTitle: '출금 신청'
        },
        controller: "WithdrawalCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/pages/css/profile.min.css',
                '../assets/global/plugins/nouislider/nouislider.min.css',
                '../assets/global/plugins/nouislider/nouislider.min.js',
                '../assets/global/plugins/nouislider/wNumb.min.js',
                '../assets/global/plugins/bootbox/bootbox.min.js',

                'interfaces/withdrawal/service.js',
                'interfaces/withdrawal/controller.js'
              ]
            });
          }],
          init: ['deps', 'WithdrawalService', function(deps, WithdrawalService) {
            return WithdrawalService.Init();
          }]
        }
      }))

      // Dashboard
      .state('message', StateOptionWrapper({
        url: "/message",
        templateUrl: "interfaces/message/view.html",
        data: {
          pageTitle: '쪽지함'
        },
        controller: "MessageCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootbox/bootbox.min.js',
                '../assets/apps/css/inbox.min.css',

                'interfaces/message/service.js',
                'interfaces/message/controller.js'
              ]
            });
          }],
          init: ['deps', 'MessageService', function(deps, MessageService) {
            return MessageService.Init();
          }],
          count: ['deps', 'MessageService', function(deps, MessageService) {
            return MessageService.Count();
          }]
        }
      }))

      // Dashboard
      .state('question', StateOptionWrapper({
        url: "/question",
        templateUrl: "interfaces/question/view.html",
        data: {
          pageTitle: '고객센터'
        },
        controller: "QuestionCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootbox/bootbox.min.js',

                'interfaces/question/service.js',
                'interfaces/question/controller.js'
              ]
            });
          }],
          init: ['deps', 'QuestionService', function(deps, QuestionService) {
            return QuestionService.Init();
          }]
        }
      }))

      // Dashboard
      .state('distributor-signup', StateOptionWrapper({
        url: "/distributor-signup",
        templateUrl: "interfaces/distributor-signup/view.html",
        data: {
          pageTitle: '총판 가입'
        },
        controller: "DistributorSignupCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootbox/bootbox.min.js',

                'interfaces/distributor-signup/service.js',
                'interfaces/distributor-signup/controller.js'
              ]
            });
          }],
          init: ['deps', 'DistributorSignupService', function(deps, DistributorSignupService) {
            return DistributorSignupService.Init();
          }]
        }
      }))

      // Dashboard
      .state('distributor-setup', StateOptionWrapper({
        url: "/distributor-setup",
        templateUrl: "interfaces/distributor-setup/view.html",
        data: {
          pageTitle: '총판 생성'
        },
        controller: "DistributorSetupCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootbox/bootbox.min.js',

                'interfaces/distributor-setup/service.js',
                'interfaces/distributor-setup/controller.js'
              ]
            });
          }],
          init: ['deps', 'DistributorSetupService', function(deps, DistributorSetupService) {
            return DistributorSetupService.Init();
          }],
          config: ['deps', 'DistributorSetupService', function(deps, DistributorSetupService) {
            return DistributorSetupService.Config();
          }]
        }
      }))

      .state('distributor-info', StateOptionWrapper({
        url: "/distributor-info",
        templateUrl: "interfaces/distributor-info/view.html",
        data: {
          pageTitle: '총판 정보'
        },
        controller: "DistributorInfoCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootbox/bootbox.min.js',

                'interfaces/distributor-info/service.js',
                'interfaces/distributor-info/controller.js'
              ]
            });
          }],
          init: ['deps', 'DistributorInfoService', function(deps, DistributorInfoService) {
            return DistributorInfoService.Init();
          }],
          info: ['deps', 'DistributorInfoService', function(deps, DistributorInfoService) {
            return DistributorInfoService.Info();
          }]
        }
      }))

      .state('board-free', StateOptionWrapper({
        url: "/board/free",
        templateUrl: "interfaces/board/view.html",
        data: {
          pageTitle: '자유게시판'
        },
        controller: "BoardCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootstrap-summernote/summernote.css',

                '../assets/global/plugins/bootbox/bootbox.min.js',
                '../assets/global/plugins/bootstrap-summernote/summernote.min.js',

                'interfaces/board/style.css',
                'interfaces/board/service.js',
                'interfaces/board/controller.js'
              ],
            });
          }],
          deps2: ['deps', '$ocLazyLoad', function(deps, $ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootstrap-summernote/lang/summernote-ko-KR.min.js'
              ],
            });
          }],
          init: ['deps', 'BoardService', function(deps, BoardService) {
            return BoardService.Init('free');
          }]
        }
      }))

      .state('board-knowhow', StateOptionWrapper({
        url: "/board/knowhow",
        templateUrl: "interfaces/board/view.html",
        data: {
          pageTitle: '노하우/공략'
        },
        controller: "BoardCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootstrap-summernote/summernote.css',

                '../assets/global/plugins/bootbox/bootbox.min.js',
                '../assets/global/plugins/bootstrap-summernote/summernote.min.js',

                'interfaces/board/style.css',
                'interfaces/board/service.js',
                'interfaces/board/controller.js'
              ],
            });
          }],
          deps2: ['deps', '$ocLazyLoad', function(deps, $ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootstrap-summernote/lang/summernote-ko-KR.min.js'
              ],
            });
          }],
          init: ['deps', 'BoardService', function(deps, BoardService) {
            return BoardService.Init('knowhow');
          }]
        }
      }))

      .state('board-suggestion', StateOptionWrapper({
        url: "/board/suggestion",
        templateUrl: "interfaces/board/view.html",
        data: {
          pageTitle: '노하우/공략'
        },
        controller: "BoardCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootstrap-summernote/summernote.css',

                '../assets/global/plugins/bootbox/bootbox.min.js',
                '../assets/global/plugins/bootstrap-summernote/summernote.min.js',

                'interfaces/board/style.css',
                'interfaces/board/service.js',
                'interfaces/board/controller.js'
              ],
            });
          }],
          deps2: ['deps', '$ocLazyLoad', function(deps, $ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootstrap-summernote/lang/summernote-ko-KR.min.js'
              ],
            });
          }],
          init: ['deps', 'BoardService', function(deps, BoardService) {
            return BoardService.Init('suggestion');
          }]
        }
      }))

      .state('board-distributor', StateOptionWrapper({
        url: "/board/distributor",
        templateUrl: "interfaces/board/view.html",
        data: {
          pageTitle: '총판게시판'
        },
        controller: "BoardCtrl",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootstrap-summernote/summernote.css',

                '../assets/global/plugins/bootbox/bootbox.min.js',
                '../assets/global/plugins/bootstrap-summernote/summernote.min.js',

                'interfaces/board/style.css',
                'interfaces/board/service.js',
                'interfaces/board/controller.js'
              ],
            });
          }],
          deps2: ['deps', '$ocLazyLoad', function(deps, $ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'TOX2APP',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                '../assets/global/plugins/bootstrap-summernote/lang/summernote-ko-KR.min.js'
              ],
            });
          }],
          init: ['deps', 'BoardService', function(deps, BoardService) {
            return BoardService.Init('distributor');
          }]
        }
      }))

    // // Dashboard
    // .state('dashboard', {
    //   url: "/dashboard.html",
    //   templateUrl: "views/dashboard.html",
    //   data: {
    //     pageTitle: 'Admin Dashboard Template'
    //   },
    //   controller: "DashboardController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load({
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    //         files: [
    //           '../assets/global/plugins/morris/morris.css',
    //           '../assets/global/plugins/morris/morris.min.js',
    //           '../assets/global/plugins/morris/raphael-min.js',
    //           '../assets/global/plugins/jquery.sparkline.min.js',
    //
    //           '../assets/pages/scripts/dashboard.min.js',
    //           'js/controllers/DashboardController.js',
    //         ]
    //       });
    //     }]
    //   }
    // })
    //
    // // Blank Page
    // .state('blank', {
    //   url: "/blank",
    //   templateUrl: "views/blank.html",
    //   data: {
    //     pageTitle: 'Blank Page Template'
    //   },
    //   controller: "BlankController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load({
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    //         files: [
    //           'js/controllers/BlankController.js'
    //         ]
    //       });
    //     }]
    //   }
    // })
    //
    // // AngularJS plugins
    // .state('fileupload', {
    //   url: "/file_upload.html",
    //   templateUrl: "views/file_upload.html",
    //   data: {
    //     pageTitle: 'AngularJS File Upload'
    //   },
    //   controller: "GeneralPageController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load([{
    //         name: 'angularFileUpload',
    //         files: [
    //           '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
    //         ]
    //       }, {
    //         name: 'TOX2APP',
    //         files: [
    //           'js/controllers/GeneralPageController.js'
    //         ]
    //       }]);
    //     }]
    //   }
    // })
    //
    // // UI Select
    // .state('uiselect', {
    //   url: "/ui_select.html",
    //   templateUrl: "views/ui_select.html",
    //   data: {
    //     pageTitle: 'AngularJS Ui Select'
    //   },
    //   controller: "UISelectController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load([{
    //         name: 'ui.select',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
    //         files: [
    //           '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
    //           '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
    //         ]
    //       }, {
    //         name: 'TOX2APP',
    //         files: [
    //           'js/controllers/UISelectController.js'
    //         ]
    //       }]);
    //     }]
    //   }
    // })
    //
    // // UI Bootstrap
    // .state('uibootstrap', {
    //   url: "/ui_bootstrap.html",
    //   templateUrl: "views/ui_bootstrap.html",
    //   data: {
    //     pageTitle: 'AngularJS UI Bootstrap'
    //   },
    //   controller: "GeneralPageController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load([{
    //         name: 'TOX2APP',
    //         files: [
    //           'js/controllers/GeneralPageController.js'
    //         ]
    //       }]);
    //     }]
    //   }
    // })
    //
    // // Tree View
    // .state('tree', {
    //   url: "/tree",
    //   templateUrl: "views/tree.html",
    //   data: {
    //     pageTitle: 'jQuery Tree View'
    //   },
    //   controller: "GeneralPageController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load([{
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
    //         files: [
    //           '../assets/global/plugins/jstree/dist/themes/default/style.min.css',
    //
    //           '../assets/global/plugins/jstree/dist/jstree.min.js',
    //           '../assets/pages/scripts/ui-tree.min.js',
    //           'js/controllers/GeneralPageController.js'
    //         ]
    //       }]);
    //     }]
    //   }
    // })
    //
    // // Form Tools
    // .state('formtools', {
    //   url: "/form-tools",
    //   templateUrl: "views/form_tools.html",
    //   data: {
    //     pageTitle: 'Form Tools'
    //   },
    //   controller: "GeneralPageController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load([{
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
    //         files: [
    //           '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
    //           '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
    //           '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
    //           '../assets/global/plugins/typeahead/typeahead.css',
    //
    //           '../assets/global/plugins/fuelux/js/spinner.min.js',
    //           '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
    //           '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
    //           '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
    //           '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
    //           '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
    //           '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
    //           '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
    //           '../assets/global/plugins/typeahead/handlebars.min.js',
    //           '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
    //           '../assets/pages/scripts/components-form-tools-2.min.js',
    //
    //           'js/controllers/GeneralPageController.js'
    //         ]
    //       }]);
    //     }]
    //   }
    // })
    //
    // // Date & Time Pickers
    // .state('pickers', {
    //   url: "/pickers",
    //   templateUrl: "views/pickers.html",
    //   data: {
    //     pageTitle: 'Date & Time Pickers'
    //   },
    //   controller: "GeneralPageController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load([{
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
    //         files: [
    //           '../assets/global/plugins/clockface/css/clockface.css',
    //           '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
    //           '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
    //           '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
    //           '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
    //
    //           '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
    //           '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
    //           '../assets/global/plugins/clockface/js/clockface.js',
    //           '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
    //           '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
    //
    //           '../assets/pages/scripts/components-date-time-pickers.min.js',
    //
    //           'js/controllers/GeneralPageController.js'
    //         ]
    //       }]);
    //     }]
    //   }
    // })
    //
    // // Custom Dropdowns
    // .state('dropdowns', {
    //   url: "/dropdowns",
    //   templateUrl: "views/dropdowns.html",
    //   data: {
    //     pageTitle: 'Custom Dropdowns'
    //   },
    //   controller: "GeneralPageController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load([{
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
    //         files: [
    //           '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
    //           '../assets/global/plugins/select2/css/select2.min.css',
    //           '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
    //
    //           '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
    //           '../assets/global/plugins/select2/js/select2.full.min.js',
    //
    //           '../assets/pages/scripts/components-bootstrap-select.min.js',
    //           '../assets/pages/scripts/components-select2.min.js',
    //
    //           'js/controllers/GeneralPageController.js'
    //         ]
    //       }]);
    //     }]
    //   }
    // })
    //
    // // Advanced Datatables
    // .state('datatablesmanaged', {
    //   url: "/datatables/managed.html",
    //   templateUrl: "views/datatables/managed.html",
    //   data: {
    //     pageTitle: 'Advanced Datatables'
    //   },
    //   controller: "GeneralPageController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load({
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
    //         files: [
    //           '../assets/global/plugins/datatables/datatables.min.css',
    //           '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
    //
    //           '../assets/global/plugins/datatables/datatables.all.min.js',
    //
    //           '../assets/pages/scripts/table-datatables-managed.min.js',
    //
    //           'js/controllers/GeneralPageController.js'
    //         ]
    //       });
    //     }]
    //   }
    // })
    //
    // // Ajax Datetables
    // .state('datatablesajax', {
    //   url: "/datatables/ajax.html",
    //   templateUrl: "views/datatables/ajax.html",
    //   data: {
    //     pageTitle: 'Ajax Datatables'
    //   },
    //   controller: "GeneralPageController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load({
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
    //         files: [
    //           '../assets/global/plugins/datatables/datatables.min.css',
    //           '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
    //           '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
    //
    //           '../assets/global/plugins/datatables/datatables.all.min.js',
    //           '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
    //           '../assets/global/scripts/datatable.js',
    //
    //           'js/scripts/table-ajax.js',
    //           'js/controllers/GeneralPageController.js'
    //         ]
    //       });
    //     }]
    //   }
    // })
    //
    // // User Profile
    // .state("profile", {
    //   url: "/profile",
    //   templateUrl: "views/profile/main.html",
    //   data: {
    //     pageTitle: 'User Profile'
    //   },
    //   controller: "UserProfileController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load({
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
    //         files: [
    //           '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
    //           '../assets/pages/css/profile.css',
    //
    //           '../assets/global/plugins/jquery.sparkline.min.js',
    //           '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
    //
    //           '../assets/pages/scripts/profile.min.js',
    //
    //           'js/controllers/UserProfileController.js'
    //         ]
    //       });
    //     }]
    //   }
    // })
    //
    // // User Profile Dashboard
    // .state("profile.dashboard", {
    //   url: "/dashboard",
    //   templateUrl: "views/profile/dashboard.html",
    //   data: {
    //     pageTitle: 'User Profile'
    //   }
    // })
    //
    // // User Profile Account
    // .state("profile.account", {
    //   url: "/account",
    //   templateUrl: "views/profile/account.html",
    //   data: {
    //     pageTitle: 'User Account'
    //   }
    // })
    //
    // // User Profile Help
    // .state("profile.help", {
    //   url: "/help",
    //   templateUrl: "views/profile/help.html",
    //   data: {
    //     pageTitle: 'User Help'
    //   }
    // })
    //
    // // Todo
    // .state('todo', {
    //   url: "/todo",
    //   templateUrl: "views/todo.html",
    //   data: {
    //     pageTitle: 'Todo'
    //   },
    //   controller: "TodoController",
    //   resolve: {
    //     deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //       return $ocLazyLoad.load({
    //         name: 'TOX2APP',
    //         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
    //         files: [
    //           '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
    //           '../assets/apps/css/todo-2.css',
    //           '../assets/global/plugins/select2/css/select2.min.css',
    //           '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
    //
    //           '../assets/global/plugins/select2/js/select2.full.min.js',
    //
    //           '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
    //
    //           '../assets/apps/scripts/todo-2.min.js',
    //
    //           'js/controllers/TodoController.js'
    //         ]
    //       });
    //     }]
    //   }
    // })

  }]);
