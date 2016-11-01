var _app = angular.module(ApplicationName);

_app.controller('HeaderCtrl', function($rootScope, $scope) {

    // $scope.logout = function() {
    //     AuthService.logout().run(function(res) {
    //         $rootScope.currentUser = null;
    //         $rootScope.session = false;
    //         $location.path('/login');
    //     }, function(err) {});
    // };
    //
    // $scope.submenu = $rootScope.submenu;

    $rootScope.mainmenu = [];

    //메뉴 : 입/출금
    $rootScope.mainmenu.push({
        name: '입/출금',
        submenu: [{
            name: '입금 관리',
            path: '/finance/deposit'
        }, {
            name: '출금 관리',
            path: '/finance/withdrawal'
        }, {
            name: '캐쉬 관리',
            path: '/finance/cash'
        }, {
            name: '포인트 관리',
            path: '/finance/point'
        }, {
            name: '입/출금 통계',
            path: '/finance/stat'
        }]
    });

    $rootScope.mainmenu.push({
        name: '매치',
        submenu:  [{
            name: '매치 관리',
            path: '/match'
        }, {
            name: '종목 관리',
            path: '/match/kind'
        }, {
            name: '리그 관리',
            path: '/match/league'
        }, {
            name: '실시간 배팅 관리',
            path: '/match/bet'
        }, {
            name: '배팅 통계',
            path: '/match/stat'
        }]
    });

    $rootScope.mainmenu.push({
        name: '회원',
        submenu:  [{
            name: '회원 관리',
            path: '/user'
        }, {
            name: '접속기록',
            path: '/user/history'
        }, {
            name: '회원 통계',
            path: '/user/stat'
        }]
    });

    $rootScope.mainmenu.push({
        name: '고객센터',
        submenu:  [{
            name: '고객문의',
            path: '/client/question'
        }, {
            name: '게시판 관리',
            path: '/client/board'
        }, {
            name: '메시지 관리',
            path: '/client/message'
        }]
    });

    $rootScope.mainmenu.push({
        name: '사이트',
        submenu:  [{
            name: '사이트 관리',
            path: '/site'
        }, {
            name: '사이트 상세설정',
            path: '/site/detail'
        }]
    });

    $rootScope.mainmenu.push({
        name: '총판',
        submenu:  [{
            name: '총판 관리',
            path: '/distributor'
        }, {
            name: '총판 회원 관리',
            path: '/distributor/member'
        }]
    });

    $rootScope.mainmenu.push({
        name: '설정',
        submenu:  [{
            name: '레벨 설정',
            path: '/setting/level'
        }, {
            name: '배팅 설정',
            path: '/setting/betting'
        }, {
            name: '블랙리스트',
            path: '/setting/blacklist'
        }]
    });

});