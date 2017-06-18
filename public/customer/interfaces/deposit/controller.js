/* Setup blank page controller */
angular.module('TOX2APP').controller('DepositCtrl', [
  '$rootScope', '$scope', '$timeout',
  'UserService', 'DepositService', 'PublicFactory', 'settings', 'init',
  function(
    $rootScope, $scope, $timeout,
    UserService, DepositService, PublicFactory, settings, init
  ) {
    $scope.$on('$viewContentLoaded', function() {

      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = true;
      $rootScope.settings.layout.pageBodySolid = false;
      $rootScope.settings.layout.pageSidebarClosed = false;

      var Slider = document.getElementById('slider');
      if (Slider) {

        noUiSlider.create(Slider, {
          start: 10000,
          connect: 'lower',
          step: 10000,
          range: {
            min: 0,
            max: 2000000
          },
          format: wNumb({
            mark: null,
            decimals: 1
          })
        });

        Slider.noUiSlider.on('update', function(values, handle) {
          $timeout(function() {
            $scope.depositCash = values[handle];
          }, 0);
        });

        $scope._slider = Slider;
      }

    });

    //***********************************************************************************************************
    //// Common Member Vars.

    $scope._path = init.path;
    $scope._query = init.query;
    $scope._breadcrumb = [{
      path: '',
      name: '계정',
      icon: 'icon-home'
    }, {
      path: 'deposit',
      name: '입금',
      icon: 'icon-home'
    }];

    $scope._pages = null;
    $scope._pageCount = null;

    $scope._list = null;

    $scope._slider = null;

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope._StartLoading = function() {
      App.blockUI({
        target: '.page-content',
        overlayColor: 'none',
        animate: true
      });
    };

    $scope._EndLoading = function() {
      App.unblockUI('.page-content');
    };

    $scope._MovePage = function(page) {
      $scope._query.page = Number(page);
      $scope.List();
    };

    $scope._NextPage = function() {
      var page = Number($scope._query.page);
      var totalPage = Number($scope._pageCount);
      if (page < totalPage) {
        $scope._query.page = page + 1;
        $scope.List();
      }
    };

    $scope._PreviousPage = function() {
      var page = Number($scope._query.page);
      if ((page - 1) > 0) {
        $scope._query.page = page - 1;
        $scope.List();
      }
    };

    $scope._LastPage = function() {
      $scope._query.page = Number($scope._pageCount);
      $scope.List();
    };

    $scope._FirstPage = function() {
      $scope._query.page = 1;
      $scope.List();
    };


    //***********************************************************************************************************
    //// Local Vars.

    $scope.depositCash = null;

    //***********************************************************************************************************
    //// Local Functions.

    $scope.Send = function() {

      $scope._StartLoading();
      DepositService.SendDepositReport({
          cash: $scope.depositCash
        }, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        })
        .then(function() {
          return DepositService.List($scope._query,
            function(data, defer) {
              if (data.failure) return defer.reject(data.failure);
              $scope.RenderList(data.count, data.docs);
              defer.resolve();
            });
        })
        .then(function() {
          $scope.ResetCash();
          $scope._EndLoading();
          bootbox.alert('신청하였습니다.');
        })
        .catch(function (msg) {
          $scope._EndLoading();
          bootbox.alert(msg);
        });
    };

    $scope.List = function() {
      $scope._StartLoading();
      DepositService.List($scope._query, function(data) {
        $scope._EndLoading();
        if (data.failure) return bootbox.alert(data.failure);
        $scope.RenderList(data.lastPage, data.docs);
      });
    };

    $scope.RenderList = function(lastPage, list) {
      $scope._list = list;
      $scope._pageCount = lastPage;
      $scope._pages = PublicFactory.Pagination($scope._query.page, $scope._pageCount, $scope._path, $scope._query);
    };

    $scope.AddCash = function(value) {
      var depositCash = value + parseInt($scope.depositCash);
      $scope.depositCash = depositCash;
      if ($scope._slider !== null) $scope._slider.noUiSlider.set([depositCash]);
    };

    $scope.ResetCash = function(value) {
      $scope.depositCash = 10000;
      if ($scope._slider !== null) $scope._slider.noUiSlider.set([10000]);
    };


    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.data.lastPage, init.data.docs);
  }
]);
