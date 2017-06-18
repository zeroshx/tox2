var app = angular.module(ApplicationName);
app.factory('PublicService', function($httpParamSerializer) {
  return {
    Pagination: function(curPage, totalPage, baseUrl, curQuery) {
      var pages = [];
      var query = {};
      angular.copy(curQuery, query);
      var where = curPage % 8;
      if (where === 0) {
        where = 8;
      }

      pages[where - 1] = {
        number: curPage,
        active: true,
        link: baseUrl + '?' + $httpParamSerializer(query)
      };

      for (i = 0; i < (where - 1); i++) {
        query.page = curPage - i - 1;
        pages[where - i - 2] = {
          number: curPage - i - 1,
          active: false,
          link: baseUrl + '?' + $httpParamSerializer(query)
        };
      }

      for (i = 0; i < (8 - where); i++) {
        if (curPage + i + 1 <= totalPage) {
          query.page = curPage + i + 1;
          pages[where + i] = {
            number: curPage + i + 1,
            active: false,
            link: baseUrl + '?' + $httpParamSerializer(query)
          };
        }
      }

      return pages;
    },

    RefreshContorller: {
      _elapsedTime: null,
      _timer: null,
      Init: function() {
        if (this._timer) {
          clearInterval(this._timer);
        }
        this._timer = null;
        this._elapsedTime = 0;
      },
      Run: function(sec, onTick, onSuccess) {
        if (typeof(sec) !== 'number') return;
        if (typeof(onTick) !== 'function') return;
        if (typeof(onSuccess) !== 'function') return;
        var rc = this;
        if(rc._timer) return;
        rc.Init();
        rc._timer = setInterval(function() {
          rc._elapsedTime++;
          onTick(sec-rc._elapsedTime);
          if(rc._elapsedTime === sec) {
            rc.Init();
          }
        }, 1000);
        onSuccess();
      }
    }
  };
});
