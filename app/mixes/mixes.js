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

