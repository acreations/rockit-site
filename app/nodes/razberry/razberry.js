'use strict';

angular.module('razberry', [])

.config(function ($routeProvider) {
  $routeProvider.when('/nodes/razberry/:node*', {
    templateUrl: 'nodes/razberry/razberry.html',
    controller:  'RazberryCtrl'
  });
})

.controller('RazberryCtrl', ['$scope', '$log', '$routeParams', '$translatePartialLoader', '$translate', '$sce', '$modal','repository',
  function ($scope, $log, $routeParams, $translatePartialLoader, $translate, $sce, $modal, repository) {

  $scope.favorite = false;
  $scope.statuses = {};

  var responses = {};

  var commands = {
    'binary': function(command) {
      repository.get(command.urls[command.values.current ? 'on':'off']).then(
        function(data) {
          $log.debug('Repository :: success', data);

          command.values.current = data.data;

          pushStatusMessage($scope.statuses.commands, 'success', 'COMMAND_BINARY_SUCCESS_TITLE', 'COMMAND_BINARY_SUCCESS');
            
        }, function(reason) {
          $log.warn('Repository :: reject', reason);
        }, function(update) {
          $log.info('Repository:: updates', update);
        }
      );
    }
  };

  $scope.clearStatus = function(status) {
    $log.debug(':: Clear status', status);

    status.messages = [];
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

  $scope.onChangeCommand = function(command) {
    if(command && commands.hasOwnProperty(command.type)) {
      commands[command.type](command);
    } else {
      $log.warn(':: Command not supported', command);
    }
  };

  $scope.refresh = function() {
    $log.debug(':: Refresh');

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

    $scope.statuses.commands = [];
  };

  $scope.resetCommandStatuses = function() {
    $scope.statuses.commands = [];
  };

  $scope.toggleFavorite = function() {
    $log.debug(':: Toggle as favorite');

    $scope.favorite = !$scope.favorite;
  };

  var pushStatusMessage = function(status, cls, title, message) {
    status.push({
      'class': cls,
      'title': title,
      'message': message
    });
  };

  var onCreate = function() {
    $log.debug(':: Created Razberry controller');

    $translatePartialLoader.addPart('nodes-razberry');
    $translate.refresh();

    $sce.trustAsUrl($routeParams.node);

    $scope.refresh();
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