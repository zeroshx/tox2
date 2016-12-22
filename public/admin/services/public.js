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
        }
    };
});
