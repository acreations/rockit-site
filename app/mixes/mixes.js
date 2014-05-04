'use strict';

angular.module('mixes', [
  'mixes.services'
])

.config(function ($routeProvider) {
  $routeProvider.when('/mixes', {
    templateUrl: 'mixes/mixes.html',
    controller:  'MixesCtrl'
  });
})

.controller('MixesCtrl', ['$scope', '$log', 'whenRepository', function ($scope, $log, when) {

  $scope.when;

  var onCreate = function() {
    retrieveWhenStatements();
  };

  var retrieveWhenStatements = function() {
    when.list().then(
      function(response) {
        $log.debug('Retrieved when statements', response)
        $scope.when = response.data
      },
      function(error) {
        $log.error('Could not get any when statements')
      })
  };

  onCreate();

}]);