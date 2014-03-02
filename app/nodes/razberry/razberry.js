'use strict';

angular.module('razberry', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/nodes/razberry/:node*', {
    templateUrl: 'nodes/razberry/razberry.html',
    controller:  'RazberryCtrl'
  });
})

.controller('RazberryCtrl', ['$scope', '$log', '$routeParams', '$translatePartialLoader', '$translate', '$sce', 'repository',
  function ($scope, $log, $routeParams, $translatePartialLoader, $translate, $sce, repository) {

  var responses = {};

  $scope.activateCommand = function(command, value) {
    $log.debug(':: Selected command with value', value);

    repository.get(command.urls[value]).then(
      function(data) {
        $log.debug('Repository :: success', data);

        command.values.current = data.data;

      }, function(reason) {
        $log.warn('Repository :: reject', reason);
      }, function(update) {
        $log.info('Repository:: updates', update);
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

    $scope.edit.association = responses.node.association;

    genericRepository.update($scope.node.url, $scope.edit).then(
      function(data) {
        $log.debug('Repository :: Update success ', data);

        responses.node.name = data.name;
        responses.node.association = data.association;

        $scope.editReset();

      }, function(reason) {
        $log.warn('Repository :: reject', reason);
      }, function(update) {
        $log.info('Repository :: updates', update);
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

    repository.get($routeParams.node).then(
      function(data) {
        $log.debug('Repository :: success', data);

        responses.node = data;

        $scope.node = responses.node;
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