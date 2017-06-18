/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var TOX2APP = angular.module("TOX2APP", [
  "ui.router",
  "ui.bootstrap",
  "oc.lazyLoad",
  "ngSanitize"
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
  $controllerProvider.allowGlobals();
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
      pageAutoScrollOnLoad: 200 // auto scroll to top on page load
    },
    assetsPath: '../assets',
    globalPath: '../assets/global',
    layoutPath: '../assets/layouts/layout2',
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

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Init global settings and run the app */
TOX2APP.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
  $rootScope.$state = $state; // state to be accessed from view
  $rootScope.$settings = settings; // state to be accessed from view

  $rootScope.__SetUser = function (property, value) {
    if(angular.isObject($rootScope.__user)) {
      $rootScope.__user[property] = value;
      return;
    }
    $rootScope.__user = {};
    $rootScope.__user[property] = value;
  };

  $rootScope.__GetUser = function (property) {
    if(angular.isObject($rootScope.__user)) {
      return $rootScope.__user[property];
    }
    return undefined;
  };

  $rootScope.__DeleteUser = function (property) {
    if(property) {
      delete $rootScope.__user[property];
      return;
    }
    delete $rootScope.__user;
  };


  $rootScope.__SetLegacy = function (property, value) {
    if(angular.isObject($rootScope.__legacy)) {
      $rootScope.__legacy[property] = value;
      return;
    }
    $rootScope.__legacy = {};
    $rootScope.__legacy[property] = value;
  };

  $rootScope.__GetLegacy = function (property) {
    if(angular.isObject($rootScope.__legacy)) {
      return $rootScope.__legacy[property];
    }
    return undefined;
  };

  $rootScope.__DeleteLegacy = function (property) {
    if(property) {
      delete $rootScope.__legacy[property];
      return;
    }
    delete $rootScope.__legacy;
  };
}]);
