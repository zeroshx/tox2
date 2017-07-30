/* Setup Layout Part - Quick Sidebar */
angular.module("TOX2ADMINAPP")
  .controller('QuickSidebarController', ['$rootScope', '$scope', '$timeout', 'CRUDFactory', 'PApi',
    function($rootScope, $scope, $timeout, CRUDFactory, PApi) {
      $scope.$on('$includeContentLoaded', function() {
        $timeout(function() {
          QuickSidebar.init(); // init quick sidebar
          $scope._item.me = $rootScope.__GetUser('me');
        }, 3000);
      });

      var ErrorHandler = function(error) {
        console.log(error);
        PApi.Alert('메신저 접속이 종료되었습니다. 새로고침 후에 다시 시도 바랍니다.');
      };

      $scope._item = {
        me: null,
        selectedRoom: '',
        text: '',
        roomName: '',
        roomList: [],
        chatList: []
      };

      $scope._flag = {
        actionMode: 'LIST'
      };

      var socket = io({
        path: '/messenger'
      });

      socket.on('connect', function(socket) {
        console.log('Messenger Server Connected.');
      });

      socket.on('disconnect', function(socket) {
        console.error('Messenger Server Disconnected.');
      });

      socket.on('new', function(msg) {
        if (msg.room === $scope._item.selectedRoom) {
          $scope.GetMessage('ATTACH');
        } else {
          for (var i in $scope._item.roomList) {
            if ($scope._item.roomList[i].name === msg.room) {
              if (typeof $scope._item.roomList[i].stack === 'number') {
                $scope._item.roomList[i].stack++;
              } else {
                $scope._item.roomList[i].stack = 1;
              }
              if (typeof $rootScope.__GetUser('newMsgTotal') === 'number') {
                $rootScope.__SetUser('newMsgTotal', $rootScope.__GetUser('newMsgTotal') + 1);
              } else {
                $rootScope.__SetUser('newMsgTotal', 1);
              }
              $rootScope.$apply();
              $scope.$apply();
              return;
            }
          }
        }
      });

      $scope.KeyControl = function(e) {
        if (e.which === 13) {
          if (!e.shiftKey) {
            $scope.Send();
            e.preventDefault();
          }
        }
      };

      $scope.JoinRoom = function(name) {
        $scope._flag.actionMode = 'CHAT';
        $scope._item.selectedRoom = name;
        $scope.GetMessage('INIT');
        for (var i in $scope._item.roomList) {
          if ($scope._item.roomList[i].name === name) {
            $rootScope.__SetUser('newMsgTotal', $rootScope.__GetUser('newMsgTotal') - $scope._item.roomList[i].stack);
            $scope._item.roomList[i].stack = 0;
            return;
          }
        }
      };

      $scope.OutRoom = function() {
        $scope._flag.actionMode = 'LIST';
        $scope._item.selectedRoom = null;
        $scope._item.chatList = [];
      };

      $scope.GetMessengerRoomList = function() {
        PApi.StartLoading();
        CRUDFactory.READ(
          '/config/manager/messenger/room', {},
          function(data) {
            PApi.EndLoading();
            $scope._item.roomList = data.room;
          }, ErrorHandler);
      };

      $scope.AddMessengerRoom = function(id) {
        PApi.StartLoading();
        CRUDFactory.CREATE(
          '/config/manager/messenger/room', {
            item: {
              name: $scope._item.roomName
            }
          },
          function(data) {
            PApi.EndLoading();
            if (data.failure) return PApi.Alert(data.failure);
            $scope.GetMessengerRoomList();
            $scope._item.roomName = '';
          }, ErrorHandler);
      };

      $scope.RemoveMessengerRoom = function(id) {
        PApi.Confirm('정말 채팅방을 삭제하시겠습니까? 지난 대화는 동일 이름의 채팅방을 개설하면 복구됩니다.', function(ok) {
          if (ok) {
            PApi.StartLoading();
            CRUDFactory.UPDATE(
              '/config/manager/messenger/room', {
                id: id
              },
              function(data) {
                PApi.EndLoading();
                if (data.failure) return PApi.Alert(data.failure);
                $scope.GetMessengerRoomList();
              }, ErrorHandler);
          }
        });
      };

      $scope.GetMessage = function(mode) {
        var count = 50;
        if (mode === 'ATTACH') {
          count = 1;
        }
        CRUDFactory.READ(
          '/messenger', {
            room: $scope._item.selectedRoom,
            count: count
          },
          function(data) {
            if (mode === 'ATTACH') {
              $scope._item.chatList = $scope._item.chatList.concat(data);
            } else {
              $scope._item.chatList = data;
            }
            $timeout(function() {
              angular.element('.messenger-body-chat-content').slimScroll({
                scrollTo: angular.element('.messenger-body-chat-content').prop('scrollHeight')
              });
            });
          }, ErrorHandler);
      };

      $scope.Send = function() {
        if (!$scope._item.text) return;
        CRUDFactory.CREATE(
          '/messenger', {
            room: $scope._item.selectedRoom,
            text: $scope._item.text
          },
          function(data) {
            if (data.failure) return PApi.Alert(data.failure);
            socket.emit('add', {
              room: $scope._item.selectedRoom,
              uid: $scope._item.me.uid
            });
            $scope._item.text = '';
          }, ErrorHandler);
      };

      $scope.GetMessengerRoomList();

    }
  ]);
