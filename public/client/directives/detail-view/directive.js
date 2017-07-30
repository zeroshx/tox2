angular.module('TOX2APP')
  .directive('detailView', ['$compile', function($compile) {

    var _basePath = 'directives/detail-view';

    return {
      templateUrl: _basePath + '/view.html',
      restrict: 'AE',
      scope: {
        _detailViewFormat: '=detailViewFormatBind'
      },
      link: function(scope, element, attrs, ctrl, transclude) {
        //
        // var OuterRender = function(columns) {
        //   var header = "<tr class='dv-tr'>";
        //   var footer = "</tr>";
        //   for (var k = 0; k < columns.length; k++) {
        //     header += columns[k];
        //   }
        //   header += footer;
        //   return header;
        // };
        //
        // var InnerRender = function(l, lc, d, dc, last) {
        //   var body = "<td class='dv-label' colspan='" + lc + "'>" + l.html() + "</td>";
        //   if (!last) {
        //     body += "<td class='dv-data' colspan='" + dc + "'>";
        //   } else {
        //     body += "<td class='dv-data last-column' colspan='" + dc + "'>";
        //   }
        //   body += d.html() + "</td>";
        //   return body;
        // };
        //
        // transclude(function(clone, transcludeScope) {
        //   for (var i = 0; i < scope._extraCount; i++) {
        //     var row = clone.find('#extra-row-' + i);
        //     var dataSetCnt = row.attr('data-set-count');
        //     var columns = [];
        //     for (var j = 0; j < dataSetCnt; j++) {
        //       var label = row.find('#extra-label-' + j);
        //       var labelColspan = label.attr('colspan');
        //       var data = row.find('#extra-data-' + j);
        //       var dataColspan = data.attr('colspan');
        //       var last = (j === dataSetCnt - 1) ? true : false;
        //       columns.push(InnerRender(label, labelColspan, data, dataColspan, last));
        //     }
        //     console.log(OuterRender(columns));
        //     element.find('#dv-tbody').append($compile(OuterRender(columns))(transcludeScope));
        //
        //   }
        // });
      },
      controller: ['$rootScope', '$scope', 'CRUDFactory', function($rootScope, $scope, CRUDFactory) {
      }]
    };
  }]);
