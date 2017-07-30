// Route State Load Spinner(used on page or content load)
angular.module("TOX2ADMINAPP")
  .directive('ngSpinnerBar', ['$rootScope', '$state',
    function($rootScope, $state) {
      return {
        link: function(scope, element, attrs) {
          // by defult hide the spinner bar
          element.addClass('hide'); // hide spinner bar by default

          // display the spinner bar whenever the route changes(the content part started loading)
          $rootScope.$on('$stateChangeStart', function() {
            element.removeClass('hide'); // show spinner bar
            $('.modal-backdrop').remove();
          });

          // hide the spinner bar on rounte change success(after the content loaded)
          $rootScope.$on('$stateChangeSuccess', function(event) {
            element.addClass('hide'); // hide spinner bar
            $('body').removeClass('page-on-load'); // remove page loading indicator
            Layout.setAngularJsSidebarMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu

            // auto scorll to page top
            setTimeout(function() {
              App.scrollTop(); // scroll to the top on content load
            }, $rootScope.settings.layout.pageAutoScrollOnLoad);
          });

          // handle errors
          $rootScope.$on('$stateNotFound', function() {
            element.addClass('hide'); // hide spinner bar
          });

          // handle errors
          $rootScope.$on('$stateChangeError', function() {
            element.addClass('hide'); // hide spinner bar
          });
        }
      };
    }
  ])

// Handle global LINK click
angular.module("TOX2ADMINAPP")
  .directive('a', function() {
    return {
      restrict: 'E',
      link: function(scope, elem, attrs) {
        if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
          elem.on('click', function(e) {
            e.preventDefault(); // prevent link click for above criteria
          });
        }
      }
    };
  });

// Handle Dropdown Hover Plugin Integration
angular.module("TOX2ADMINAPP")
  .directive('dropdownMenuHover', function() {
    return {
      link: function(scope, elem) {
        elem.dropdownHover();
      }
    };
  });

angular.module("TOX2ADMINAPP")
  .directive('stopClick', function() {
    return {
      link: function(scope, elem) {
        elem.on('click', function(e) {
          e.stopPropagation();
        });
      }
    };
  });

angular.module("TOX2ADMINAPP")
  .directive('dynamicModel', ['$compile', '$parse', function($compile, $parse) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function(scope, elem) {
        var name = $parse(elem.attr('dynamic-model'))(scope);
        elem.removeAttr('dynamic-model');
        elem.attr('data-ng-model', name);
        $compile(elem)(scope);
      }
    };
  }]);

angular.module("TOX2ADMINAPP")
  .directive('dynamicClick', ['$compile', '$parse', function($compile, $parse) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function(scope, elem) {
        var name = $parse(elem.attr('dynamic-click'))(scope);
        elem.removeAttr('dynamic-click');
        elem.attr('data-ng-click', name);
        $compile(elem)(scope);
      }
    };
  }]);

angular.module("TOX2ADMINAPP")
  .directive('dynamicClass', ['$compile', '$parse', function($compile, $parse) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function(scope, elem) {
        var name = $parse(elem.attr('dynamic-class'))(scope);
        elem.removeAttr('dynamic-class');
        elem.attr('data-ng-class', name);
        $compile(elem)(scope);
      }
    };
  }]);

angular.module("TOX2ADMINAPP")
  .directive('dynamicRepeat', ['$compile', '$parse', function($compile, $parse) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function(scope, elem) {
        var name = $parse(elem.attr('dynamic-repeat'))(scope);
        elem.removeAttr('dynamic-repeat');
        elem.attr('data-ng-repeat', name);
        $compile(elem)(scope);
      }
    };
  }]);

angular.module("TOX2ADMINAPP")
  .directive('dynamicHide', ['$compile', '$parse', function($compile, $parse) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function(scope, elem) {
        var name = $parse(elem.attr('dynamic-hide'))(scope);
        elem.removeAttr('dynamic-hide');
        elem.attr('data-ng-hide', name);
        $compile(elem)(scope);
      }
    };
  }]);


angular.module("TOX2ADMINAPP")
  .directive('dynamicNgfThumbnail', ['$compile', '$parse', function($compile, $parse) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function(scope, elem) {
        var name = $parse(elem.attr('dynamic-ngf-thumbnail'))(scope);
        elem.removeAttr('dynamic-ngf-thumbnail');
        elem.attr('ngf-thumbnail', name);
        $compile(elem)(scope);
      }
    };
  }]);

angular.module("TOX2ADMINAPP")
  .directive('onlyNumber', function() {
    return {
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        if (!ngModelCtrl) {
          return;
        }

        ngModelCtrl.$parsers.push(function(val) {
          if (angular.isUndefined(val)) {
            var val = '';
          }

          var clean = val.replace(/[^0-9]/g, '');
          if (val !== clean) {
            ngModelCtrl.$setViewValue(clean);
            ngModelCtrl.$render();
          }
          return clean;
        });

        element.bind('keypress', function(event) {
          if (event.keyCode === 32) {
            event.preventDefault();
          }
        });
      }
    };
  });
