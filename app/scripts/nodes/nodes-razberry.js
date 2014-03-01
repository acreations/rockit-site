'use strict';

angular.module('razberry', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/nodes/razberry/:node*', {
    templateUrl: 'views/pages/nodes-razberry.html',
    controller:  'RazberryCtrl'
  });
})

.controller('RazberryCtrl', ['$scope', '$log', '$routeParams', '$translatePartialLoader', '$translate', '$sce', 'genericRepository',
  function ($scope, $log, $routeParams, $translatePartialLoader, $translate, $sce, genericRepository) {

  var repository = {};

  $scope.onSelectedCommand = function(command, value) {
    $log.debug(':: Selected command with value', value);

    genericRepository.get(command.urls[value]).then(
      function(data) {
        $log.debug('Generic repository :: success', data);

        command.values.current = data.data;

      }, function(reason) {
        $log.warn('Generic repository :: reject', reason);
      }, function(update) {
        $log.info('Generic repository :: updates', update);
      }
    );

  };

  var onCreate = function() {
    $log.debug(':: Created Razberry controller');

    $translatePartialLoader.addPart('nodes-razberry');
    $translate.refresh();

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