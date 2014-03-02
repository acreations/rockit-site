'use strict';

angular.module('razberry', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/nodes/razberry/:node*', {
    templateUrl: 'nodes/razberry/razberry.html',
    controller:  'RazberryCtrl'
  });
})

.controller('RazberryCtrl', ['$scope', '$log', '$routeParams', '$translatePartialLoader', '$translate', '$sce', '$modal','repository',
  function ($scope, $log, $routeParams, $translatePartialLoader, $translate, $sce, $modal, repository) {

  $scope.favorite = false;

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

  $scope.deleteConfirm = function() {
    $log.debug(':: Open confirm modal');

    var modalInstance = $modal.open({
      templateUrl: 'common/confirm.html',
      controller: 'RockitConfirmCtrl',
      windowClass: 'confirm-modal'
    });

    modalInstance.result.then(function () {
      $log.debug(':: Trying to remove node', $scope.node);
    }, function () {
      $log.info(':: Modal dismissed at: ' + new Date());
    });
  };

  $scope.editOpen = function() {
    $log.debug(':: Open edit modal');

    var modalInstance = $modal.open({
      templateUrl: 'nodes/razberry/razberry-edit.html',
      controller: 'RazberryEditCtrl',
      resolve: {
        editItem: function () {
          var edit = {};

          if($scope.node) {
            edit.name = $scope.node.name;
          }

          return edit;
        }
      }
    });

    modalInstance.result.then(function (edit) {
      $log.debug(':: Trying to update node ', edit);

      var hasChanged = false;

      if($scope.node.name.trim() !== edit.name.trim()) {
        hasChanged = true;
      }

      if(hasChanged) {
        edit.association = responses.node.association;

        repository.update($scope.node.url, edit).then(
          function(data) {
            $log.debug('Repository :: Update success ', data);

            responses.node.name = data.name;
            responses.node.association = data.association;

          }, function(reason) {
            $log.warn('Repository :: reject', reason);
          }, function(update) {
            $log.info('Repository :: updates', update);
          }
        );
      } else {
        $log.debug(':: Nothing changed, skip updating node');
      }
    }, function () {
      $log.info(':: Modal dismissed at: ' + new Date());
    });
  };

  $scope.refreshCommandValues = function() {
    $log.debug(':: Refreshing command values');
  };

  $scope.toggleFavorite = function() {
    $log.debug(':: Toggle as favorite');

    $scope.favorite = !$scope.favorite;
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

      }, function(reason) {
        $log.warn('Repository :: reject', reason);
      }, function(update) {
        $log.info('Repository :: updates', update);
      }
    );
  };
  
  onCreate();
}])

.controller('RazberryEditCtrl', function($scope, $modalInstance, editItem) {

  $scope.edit = editItem;

  $scope.ok = function () {
    $modalInstance.close($scope.edit);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});