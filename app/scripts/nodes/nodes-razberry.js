'use strict';

angular.module('razberry', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/nodes/razberry/:node*', {
    templateUrl: 'views/pages/nodes-razberry.html',
    controller:  'RazberryCtrl'
  });
})

.controller('RazberryCtrl', ['$scope', '$log', '$routeParams', '$sce', 'genericRepository',
  function ($scope, $log, $routeParams, $sce, genericRepository) {

  var repository = {};

  var onCreate = function() {
    $log.debug('On create :: Razberry controller');
    $sce.trustAsUrl($routeParams.node);

    genericRepository.get($routeParams.node).then(
      function(data) {
        $log.debug('Generic repository :: success', data);

        repository.node = data;

        $scope.node = repository.node;

      }, function(reason) {
        $log.warn('Generic repository :: reject', reason);
      }, function(update) {
        $log.info('Generic repository :: updates', update);
      }
    );
  };
  
  onCreate();
}]);