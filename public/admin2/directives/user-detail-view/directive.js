angular.module('TOX2ADMINAPP')
  .directive('userDetailView', function() {

    var _basePath = 'directives/user-detail-view';

    return {
      templateUrl: _basePath + '/view.html',
      restrict: 'AE',
      transclude: true,
      scope: {
        _mode: '@modeBind',
        _target: '@targetBind'
      },
      link: function(scope, element, attrs, ctrl, transclude) {
        transclude(function(clone, scope) {
          element.append(clone);
        });
        element.on({
          mouseenter: function() {
            element.attr('style', 'font-weight: bold;');
          },
          mouseleave: function() {
            element.attr('style', 'font-weight: normal;');
          }
        });
        element.addClass('clickable');
        element.bind('click', scope.ModalOpen);
      },
      controller: ['$rootScope', '$scope', '$uibModal', 'PApi', function($rootScope, $scope, $uibModal, PApi) {

        $scope.ModalOpen = function() {
          if ($scope._mode !== 'UID' && $scope._mode !== 'NICK') {
            PApi.Alert('적절하지 않은 Mode입니다.');
            return;
          }

          var modalInstance = $uibModal.open({
            templateUrl: 'UserDetailModal.html',
            controller: 'UserDetailModalCtrl',
            controllerAs: '$ctrl',
            size: 'lg',
            backdrop: false,
            resolve: {
              source: function() {
                return {
                  mode: $scope._mode,
                  target: $scope._target
                }
              }
            }
          });

          modalInstance.result.then(
            function(selectedItem) {

            },
            function() {

            });
        };
      }]
    };
  });

angular.module('TOX2ADMINAPP')
  .controller('UserDetailModalCtrl', ['$uibModalInstance', '$filter', '$q', 'CRUDFactory', 'PApi', 'source',
    function($uibModalInstance, $filter, $q, CRUDFactory, PApi, source) {
      var $ctrl = this;

      $ctrl.ok = function() {
        $uibModalInstance.close('close');
      };

      $ctrl.cancel = function() {
        $uibModalInstance.dismiss('dismiss');
      };

      $ctrl.GetUserAPI = function() {
        var defer = $q.defer();
        CRUDFactory.READ(
          '/user/details', {
            mode: source.mode,
            target: source.target
          },
          function(data) {
            if (data.failure) return defer.reject(data.failure);
            var distributorValue = '';
            var accountValue = '';
            if (data.distributor.name) {
              distributorValue = data.distributor.name + ' (' + data.distributor.rank + ')';
            }
            if (data.account.bank && data.account.number) {
              accountValue = '[' + data.account.bank + '] ' + data.account.number;
            }
            $ctrl._user = data;
            $ctrl._detailViewFormat = [
              [{
                label: '아이디',
                type: 'text',
                value: data.uid,
                width: [2, 4]
              }, {
                label: '닉네임',
                type: 'text',
                value: data.nick,
                width: [2, 4]
              }],
              [{
                label: '사이트',
                type: 'text',
                value: data.site,
                width: [2, 4]
              }, {
                label: '총판',
                type: 'text',
                value: distributorValue,
                width: [2, 4]
              }],
              [{
                label: '레벨',
                type: 'text',
                value: data.level,
                width: [2, 4]
              }, {
                label: '상태',
                type: 'text',
                value: data.state,
                width: [2, 4]
              }],
              [{
                label: '캐시',
                type: 'number',
                value: data.cash,
                width: [2, 4]
              }, {
                label: '칩',
                type: 'number',
                value: data.chip,
                width: [2, 4]
              }],
              [{
                label: '포인트',
                type: 'number',
                value: data.point,
                width: [2, 4]
              }, {
                label: '수익',
                type: 'number',
                value: data.stat.deposit - data.stat.withdrawal,
                unit: '원',
                width: [2, 4]
              }],
              [{
                label: '계좌',
                type: 'text',
                value: accountValue,
                width: [2, 4]
              }, {
                label: '예금주',
                type: 'number',
                value: data.account.holder,
                width: [2, 4]
              }],
              [{
                label: '이메일',
                type: 'text',
                value: data.email,
                width: [2, 4]
              }, {
                label: '연락처',
                type: 'text',
                value: data.phone,
                width: [2, 4]
              }],
              [{
                label: '가입일시',
                type: 'text',
                value: $filter('datetime')(data.signup.date),
                width: [2, 4]
              }, {
                label: '최근 로그인',
                type: 'text',
                value: $filter('datetime')(data.login.date),
                width: [2, 4]
              }],
              [{
                label: '메모',
                type: 'user-memo',
                value: $ctrl._user,
                api: {
                  RemoveMemo: $ctrl.RemoveMemo,
                  AddMemo: $ctrl.AddMemo,
                },
                width: [2, 10]
              }]
            ];
            defer.resolve();
          },
          function(error) {
            defer.reject();
          });
        return defer.promise;
      };

      $ctrl.GetUserData = function() {
        PApi.StartLoading();
        $ctrl.GetUserAPI()
          .catch(function(legacy) {
            PApi.Alert(legacy);
          })
          .finally(function(legacy) {
            PApi.EndLoading();
          });
      };

      $ctrl.AddMemoAPI = function(memo) {
        var defer = $q.defer();
        CRUDFactory.CREATE(
          '/user/memo', {
            mode: source.mode,
            target: source.target,
            content: memo
          },
          function(data) {
            if (data.failure) return defer.reject(data.failure);
            defer.resolve();
          },
          function(error) {
            defer.reject();
          });
        return defer.promise;
      }

      $ctrl.AddMemo = function(memo) {
        if (!memo) return;
        PApi.StartLoading();
        $ctrl.AddMemoAPI(memo)
          .then(function(legacy) {
            return $ctrl.GetUserAPI();
          })
          .then(function(legacy) {
            PApi.Alert('추가되었습니다.');
          })
          .catch(function(legacy) {
            PApi.Alert(legacy);
          })
          .finally(function(legacy) {
            PApi.EndLoading();
          });
      };

      $ctrl.RemoveMemoAPI = function(id) {
        var defer = $q.defer();
        CRUDFactory.UPDATE(
          '/user/memo',
          {
            mode: source.mode,
            target: source.target,
            id: id
          },
          function(data) {
            if (data.failure) return defer.reject(data.failure);
            defer.resolve();
          },
          function(error) {
            defer.reject();
          });
        return defer.promise;
      }

      $ctrl.RemoveMemo = function(id) {
        PApi.Confirm('정말 삭제하시겠습니까?')
          .then(function(legacy) {
            PApi.StartLoading();
            return $ctrl.RemoveMemoAPI(id);
          })
          .then(function(legacy) {
            return $ctrl.GetUserAPI();
          })
          .then(function(legacy) {
            PApi.Alert('삭제되었습니다.');
          })
          .catch(function(legacy) {
            PApi.Alert(legacy);
          })
          .finally(function(legacy) {
            PApi.EndLoading();
          });
      };

      $ctrl.Reset = function() {
        $ctrl._viewMode = null;
        $ctrl._viewTitle = null;
      };

      $ctrl.ModifyMoneyReady = function() {
        if ($ctrl._viewMode === 'MODIFY_MONEY') return;
        $ctrl.modifyMoney = {
          selected: 'chip',
          amount: ''
        };
        $ctrl._viewMode = 'MODIFY_MONEY';
        $ctrl._viewTitle = 'CGP수정';
      };

      $ctrl.ModifyMoneyAPI = function(style) {
        var defer = $q.defer();
        var amount = parseInt($ctrl.modifyMoney.amount);
        if (style === 'DEC') {
          amount = -amount;
        }
        CRUDFactory.UPDATE(
          '/user/money', {
            mode: source.mode,
            target: source.target,
            type: $ctrl.modifyMoney.selected,
            amount: amount
          },
          function(data) {
            if (data.failure) return defer.reject(data.failure);
            defer.resolve();
          },
          function(error) {
            defer.reject();
          });
        return defer.promise;
      }

      $ctrl.ModifyMoney = function(style) {

        var uesrMsg = $ctrl._user.nick + '(' + $ctrl._user.uid + ')';
        var amountMsg = $filter('number')($ctrl.modifyMoney.amount);
        var typeMsg = '';
        if ($ctrl.modifyMoney.selected === 'cash') {
          typeMsg = '캐시';
        } else if ($ctrl.modifyMoney.selected === 'chip') {
          typeMsg = '칩';
        } else if ($ctrl.modifyMoney.selected === 'point') {
          typeMsg = '포인트';
        }
        var styleMsg = '';
        if (style === 'INC') styleMsg = '증가';
        else if (style === 'DEC') styleMsg = '감소';

        var msg = uesrMsg + '의 ' + typeMsg + '을(를) ' + amountMsg + ' ' + styleMsg + '시키겠습니까?';

        PApi.Confirm(msg)
          .then(function(legacy) {
            PApi.StartLoading();
            return $ctrl.ModifyMoneyAPI(style);
          })
          .then(function(legacy) {
            return $ctrl.GetUserAPI();
          })
          .then(function(legacy) {
            PApi.Alert('처리가 완료되었습니다.');
            $ctrl.Reset();
          })
          .catch(function(legacy) {
            PApi.Alert(legacy);
          })
          .finally(function() {
            PApi.EndLoading();
          });
      };

      $ctrl.BlackAPI = function() {
        var defer = $q.defer();
        CRUDFactory.CREATE(
          '/config/blacklist', {
            item: {
              type: '아이디',
              target: $ctrl._user.uid,
              memo: '관리자 설정'
            }
          },
          function(data) {
            if (data.failure) return defer.reject(data.failure);
            defer.resolve();
          },
          function(error) {
            defer.reject();
          });
        return defer.promise;
      }

      $ctrl.Black = function() {
        PApi.Confirm('블랙리스트에 추가하시겠습니까?')
          .then(function(legacy) {
            PApi.StartLoading();
            return $ctrl.BlackAPI();
          })
          .then(function(legacy) {
            PApi.Alert('처리가 완료되었습니다.');
          })
          .catch(function(legacy) {
            PApi.Alert(legacy);
          })
          .finally(function() {
            PApi.EndLoading();
          });
      };

      $ctrl.SendMessageReady = function() {
        if ($ctrl._viewMode === 'SEND_MESSAGE') return;
        $ctrl.sendMessage = {
          title: '운영진입니다.',
          content: ''
        };
        $ctrl._viewMode = 'SEND_MESSAGE';
        $ctrl._viewTitle = '쪽지보내기';
      };

      $ctrl.SendMessageAPI = function() {
        var defer = $q.defer();
        CRUDFactory.CREATE(
          '/client/message', {
            item: {
              category: '회원',
              receiver: {
                uid: $ctrl._user.uid
              },
              title: $ctrl.sendMessage.title,
              content: $ctrl.sendMessage.content
            }
          },
          function(data) {
            if (data.failure) return defer.reject(data.failure);
            defer.resolve();
          },
          function(error) {
            defer.reject();
          });
        return defer.promise;
      }

      $ctrl.SendMessage = function() {
        PApi.Confirm('쪽지를 전송하시겠습니까?')
          .then(function(legacy) {
            PApi.StartLoading();
            return $ctrl.SendMessageAPI();
          })
          .then(function(legacy) {
            PApi.Alert('전송이 완료되었습니다.');
          })
          .catch(function(legacy) {
            PApi.Alert(legacy);
          })
          .finally(function() {
            PApi.EndLoading();
          });
      };

      $ctrl.MoneyReportReady = function() {
        if ($ctrl._viewMode === 'MONEY_REPORT') return;
        $ctrl.moneyReport = {
          list: []
        };
        $ctrl._viewMode = 'MONEY_REPORT';
        $ctrl._viewTitle = '게임 머니 내역';
        $ctrl.MoneyReport();
      };

      $ctrl.MoneyReportAPI = function() {
        var defer = $q.defer();
        CRUDFactory.READ(
          '/asset/report/for-user', {
            mode: 'UID',
            target: $ctrl._user.uid
          },
          function(data) {
            if (data.failure) return defer.reject(data.failure);
            $ctrl.moneyReport.list = data.docs;
            defer.resolve();
          },
          function(error) {
            defer.reject();
          });
        return defer.promise;
      }

      $ctrl.MoneyReport = function() {
        PApi.StartLoading();
        $ctrl.MoneyReportAPI()
          .catch(function(legacy) {
            PApi.Alert(legacy);
          })
          .finally(function() {
            PApi.EndLoading();
          });
      };


      $ctrl.GetUserData();
    }
  ]);
