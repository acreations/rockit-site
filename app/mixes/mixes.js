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

.controller('MixesEditCtrl', function($scope, $modalInstance, $translate, editItem) {

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

  var normalize = function(edit) {
    angular.forEach(edit.actions, function(action) {
      if(action.type === 'radio') {
        var values = {};

        angular.forEach(action.value, function(v) {
          $translate(edit.item.modifier + '-radio-' + action.label + '-' + v).then(
            function(translations) {
              values[v] = translations;
            },
            function(error) {
              console.log(error);
            }
          );
        });
        
        action.data  = action.value[0];
        action.value = values;
      }
    });

    console.log(edit);
  }

  normalize($scope.edit);
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

  $scope.selectThen = function(item) {
    $log.debug('Selected then', item);

    select(item, 'then', 'mixes/mixes-when-edit.html', $scope.holder.then);
  }

  $scope.selectWhen = function(item) {
    $log.debug('Selected when', item);

    select(item, 'when', 'mixes/mixes-when-edit.html', $scope.holder.when);
  } 

  var normalize = function(container) {
    if(container) {
      var skipped = { 'razberry': '' };

      angular.forEach(container, function(current) {
        var skip = skipped.hasOwnProperty(current.association.entry);

        angular.forEach(current.items, function(item) {
          item.modifier = skip ? current.association.entry : item.identifier;
        });
      });
    }
  };

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

        normalize($scope.when);
        normalize($scope.then);
        normalize($scope.finish);
      },
      function(error) {
        $log.error('Could not get any when statements');
      })
  };

  var select = function(item, type, templateUrl, holder) {
    ds.get(item.url).then(
      function(data) {
        var modal = $modal.open({
          templateUrl: templateUrl,
          controller: 'MixesEditCtrl',
          resolve: {
            editItem: function () {
              var edit = {};

              edit.type = type;
              edit.item = item;
              edit.actions = data.actions.POST; 

              return edit;
            }
          }
        });

        modal.result.then(
          function(edit) {
            console.log("Add new when item to holder", edit);

            holder.push(edit);
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

  onCreate();

}]);

