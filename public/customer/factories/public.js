TOX2APP.factory('PublicFactory', ['$httpParamSerializer', function($httpParamSerializer) {

  function GetValidNumber (value, defaultValue) {
    if(value === null || value === undefined || value === '') {
      return defaultValue;
    } else if(typeof value !== 'string' && typeof value !== 'number') {
      return defaultValue;
    } else if(isNaN(value)) {
      return defaultValue;
    }
    return Number(value);
  }

  function GetValidString (value, defaultValue) {
    if(value === null || value === undefined || value === '') {
      return defaultValue;
    } else if(typeof value !== 'string') {
      return defaultValue;
    }
    return value;
  }

  return {
    Pagination: function(curPage, totalPage, baseUrl, curQuery) {
      var pages = [];
      var query = {};
      angular.copy(curQuery, query);
      var where = curPage % 5;
      if (where === 0) {
        where = 5;
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

      for (i = 0; i < (5 - where); i++) {
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

    TruncateString: function(str, length) {
      if (!angular.isString(str) || str === '') return null;
      if (str.length > length) {
        return str.substr(0, length) + '...';
      } else {
        return str;
      }
    },

    QueryValidator: function(query, policy) {
      var newQuery = {};
      for(var i = 0; i < policy.length; i++){
        if(policy[i].type === 'number') {
          newQuery[policy[i].name] = GetValidNumber(query[policy[i].name], policy[i].default);
        } else {
          newQuery[policy[i].name] = GetValidString(query[policy[i].name], policy[i].default);
        }
      }
      return newQuery;
    }
  };
}]);
