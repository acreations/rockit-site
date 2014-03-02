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

  $scope.activateCommand = function(command, value) {
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

  $scope.editReset = function() {
    $scope.edit = {};

    if($scope.node) {
      $scope.edit.name = $scope.node.name;
    }
  };

  $scope.editSave = function() {
    $log.debug(':: Update node ',$scope.edit);

    $scope.edit.association = repository.node.association;

    genericRepository.update($scope.node.url, $scope.edit).then(
      function(data) {
        $log.debug('Repository :: Update success ', data);

        repository.node.name = data.name;
        repository.node.association = data.association;

        $scope.editReset();

      }, function(reason) {
        $log.warn('Generic repository :: reject', reason);
      }, function(update) {
        $log.info('Generic repository :: updates', update);
      }
    );
  };

  $scope.refreshCommandValues = function() {
    $log.debug(':: Refreshing command values');
  };

  var onCreate = function() {
    $log.debug(':: Created Razberry controller');

    $translatePartialLoader.addPart('nodes-razberry');
    $translate.refresh();

    $sce.trustAsUrl($routeParams.node);

    genericRepository.get($routeParams.node).then(
      function(data) {
        $log.debug('Repository :: success', data);

        repository.node = data;

        $scope.node = repository.node;
        $scope.editReset();

      }, function(reason) {
        $log.warn('Repository :: reject', reason);
      }, function(update) {
        $log.info('Repository :: updates', update);
      }
    );
  };
  
  onCreate();
}]);