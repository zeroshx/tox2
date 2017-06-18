angular.module('Distributor')
  .controller('DistributorSignupCtrl', function($rootScope, $scope, $routeParams, $window, $location, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/distributor/customer';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 20),
      searchKeyword: $routeParams.searchKeyword ? $routeParams.searchKeyword : '',
      searchFilter: $routeParams.searchFilter ? $routeParams.searchFilter : ''
    };

    $scope.docs = [];

    /****************************************************************************
        Pagination setting
    ****************************************************************************/
    $scope.pages = [];
    $scope.totalPage = null;

    $scope.MovePage = function(page) {
      $scope.query.page = Number(page);
      $scope.List();
    };

    $scope.NextPage = function() {
      var page = Number($scope.query.page);
      var totalPage = Number($scope.totalPage);
      if (page < totalPage) {
        $scope.query.page = page + 1;
        $scope.List();
      }
    };

    $scope.PreviousPage = function() {
      var page = Number($scope.query.page);
      if ((page - 1) > 0) {
        $scope.query.page = page - 1;
        $scope.List();
      }
    };

    $scope.LastPage = function() {
      $scope.query.page = Number($scope.totalPage);
      $scope.List();
    };

    $scope.FirstPage = function() {
      $scope.query.page = 1;
      $scope.List();
    };

    $scope.Search = function(mode) {
      $scope.FirstPage();
    };

    /****************************************************************************
        Http CRUD setting
    ****************************************************************************/

    $scope.List = function() {
      CRUDService.Read($scope.baseUrl + '/forsite').run($scope.query, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.docs = res.docs;
        $scope.totalPage = res.count;
        $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Join = function(id) {
      CRUDService.Create($scope.baseUrl + '/join').run({
        distributor: id
      }, function(res) {
        if (res.failure) return alert(res.failure);
        else if (res.success) return alert(res.success);
      }, function(err) {
        $window.location = '/';
      });
    };

    /****************************************************************************
        Etc Functions
    ****************************************************************************/

    $scope.ResetTarget = function() {

    };

    $scope.ResetQuery = function() {
      $scope.query.page = 1;
      $scope.query.pageSize = 20;
      $scope.query.searchKeyword = '';
      $scope.query.searchFilter = '';
    };

    $scope.Reset = function() {
      $scope.ResetTarget();
      $scope.List();
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();
  });
