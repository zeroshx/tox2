TOX2APP.factory('PApi', ['$httpParamSerializer', '$q', function($httpParamSerializer, $q) {

  return {

    StartLoading: function(target) {
      if (!target) target = '.page-container';
      App.blockUI({
        target: target,
        boxed: false,
        overlayColor: 'none',
        animate: true,
        zIndex: 99999
      });
    },

    EndLoading: function(target) {
      if (!target) target = '.page-container';
      App.unblockUI(target);
    },

    Confirm: function(msg, callback) {
      var defer = $q.defer();
      var cb = function(ok) {
        if (ok) {
          defer.resolve();
        } else {
          defer.reject('취소되었습니다.');
        }
      };
      if(typeof callback === 'function') {
        cb = callback;
      }
      bootbox.confirm({
        message: msg,
        buttons: {
          confirm: {
            label: '확인',
            className: 'btn-success'
          },
          cancel: {
            label: '취소',
            className: 'btn-danger'
          }
        },
        callback: cb
      });
      return defer.promise;
    },

    Alert: function(msg, callback) {
      var defer = $q.defer();
      var cb = function() {
        defer.resolve();
      };
      if(typeof callback === 'function') {
        cb = callback;
      }
      bootbox.alert({
        message: msg,
        buttons: {
          ok: {
            label: '확인',
            className: 'btn-success'
          }
        },
        callback: cb
      });
      return defer.promise;
    },

    ScrollTop: function() {
      App.scrollTop();
    }

  };
}]);
