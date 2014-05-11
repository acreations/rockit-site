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

.controller('MixesEditCtrl', function($scope, $modalInstance, editItem) {

  $scope.edit = editItem;

  $scope.ok = function () {

    var hasError = false;

    angular.forEach($scope.edit.actions, function(action) {
      if(action.required && (!action.data || action.data.length == 0)) {
        action.hasError = true;

        hasError = true;
      } 
    });

    if(!hasError) {
      $modalInstance.close($scope.edit);
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

.controller('MixesCtrl', ['$scope', '$log', '$translatePartialLoader', '$translate', '$modal', 'mixesRepository', 'repository',
  function ($scope, $log, $translatePartialLoader, $translate, $modal, mixes, ds) {

  $scope.holder = {
    'when': [],
    'then': [],
    'finish': []
  };

  $scope.updateWhen = function(selected) {
    $log.debug('Update when', selected);

    var modal = $modal.open({
      templateUrl: 'mixes/mixes-when-edit.html',
      controller: 'MixesEditCtrl',
      resolve: {
        editItem: function () {
          return JSON.parse(JSON.stringify(selected)); // Simple clone it
        }
      }
    });

    modal.result.then(
      function(edit) {
        console.log("Updated item", edit);

        selected.item = edit.item;
        selected.actions = edit.actions;
      },
      function() {
        $log.debug("When modal dismissed ... not nothing");
      }
    );
  }

  $scope.selectWhen = function(item) {
    $log.debug('Selected when', item);

    ds.get(item.url).then(
      function(data) {
        var modal = $modal.open({
          templateUrl: 'mixes/mixes-when-edit.html',
          controller: 'MixesEditCtrl',
          resolve: {
            editItem: function () {
              var edit = {};

              edit.item = item;
              edit.actions = data.actions.POST; 

              return edit;
            }
          }
        });

        modal.result.then(
          function(edit) {
            console.log("Add new when item to holder", edit);

            $scope.holder.when.push(edit);
          },
          function() {
            $log.debug("When modal dismissed ... not nothing");
          }
        );
      },
      function(error) {
        console.log(error);
      }
    );
  } 



  var onCreate = function() {
    $translatePartialLoader.addPart('mixes');
    $translate.refresh();

    retrieveCapabilities();
  };

  var set_icon_class_placeholder = function(container) {
    var skipped = { 'razberry': '' };

    angular.forEach(container, function(current) {
      var skip = skipped.hasOwnProperty(current.association.entry);

      angular.forEach(current.items, function(item) {
        item.icon = skip ? current.association.entry : item.identifier;
      });
    });
  }

  var retrieveCapabilities = function() {
    mixes.list().then(
      function(response) {
        $log.debug('Retrieved when statements', response);

        $scope.when = response.when;
        $scope.then = response.then;
        $scope.finish = response.finish;

        set_icon_class_placeholder($scope.when);
        set_icon_class_placeholder($scope.then);
        set_icon_class_placeholder($scope.finish);
      },
      function(error) {
        $log.error('Could not get any when statements');
      })
  };

  onCreate();

}]);

