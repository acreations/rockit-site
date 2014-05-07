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

.controller('MixesCtrl', ['$scope', '$log', '$translatePartialLoader', '$translate', 'mixesRepository', 
  function ($scope, $log, $translatePartialLoader, $translate, mixes) {

  $scope.selectWhen = function(item) {
    $log.debug('Selected when', item);
  } 

  var onCreate = function() {
    $translatePartialLoader.addPart('mixes');
    $translate.refresh();

    retrieveCapabilities();
  };

  var retrieveCapabilities = function() {
    mixes.list().then(
      function(response) {
        $log.debug('Retrieved when statements', response);

        $scope.when = response.when;
        $scope.then = response.then;
        $scope.finish = response.finish;
      },
      function(error) {
        $log.error('Could not get any when statements');
      })
  };

  onCreate();

}]);