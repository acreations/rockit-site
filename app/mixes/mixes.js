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

.controller('MixesCtrl', ['$scope', '$log', '$translatePartialLoader', '$translate', '$location', '$anchorScroll', '$modal', 'mixesRepository', 'repository',
  function ($scope, $log, $translatePartialLoader, $translate, $location, $anchorScroll, $modal, mixes, ds) {

  $scope.holder = { 'when': [], 'then': [], 'finish': [] };
  $scope.select = { 'when': {}, 'then': {}, 'finish': {} };

  $scope.addMore = function(target, container) {
    $scope.save(target, container);
    $scope.scrollTo(target);
  };
  
  $scope.scrollTo = function(target) {
    if(target && $scope.select.hasOwnProperty(target)) {
      scrollTo('#' + target, function() { 
        $("#" + target + "-edit").hide();
        $scope.clear(target);
      });
    }
  };

  $scope.clear = function(target) {
    $scope.select[target] = {};
  }

  $scope.save = function(target, container, nextTarget) {
    if(!container.saved) {
      $log.debug("Saving " + target, container);

      container.saved = true;

      $scope.holder[target].push(JSON.parse(JSON.stringify(container)));
    }
    
    if(nextTarget && $scope.select.hasOwnProperty(nextTarget)) {
      scrollTo("#" + nextTarget);
      $scope.select[target] = {};
    }
  };

  $scope.onSelect = function(target, item) {
    $log.debug("Selected " + target, item);

    $("#" + target + "-edit").show();

    ds.get(item.url).then(
      function(data) {
        console.log($scope.select);
        $scope.select[target].item = item;
        $scope.select[target].actions = data.actions;

        //scrollTo('#' + target + '-edit');
      },
      function(error) {
        console.log(error);
      }
    );
  };

  $scope.update = function(target, container) {
    $log.debug('Update ' + target, container);

    var placeholder = "#" + target + "-edit";

    $scope.select[target] = container;

    $(placeholder).show();
    scrollTo(placeholder);
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

  var scrollTo = function(anchorID, callback) {
    $('html, body').animate({ scrollTop: $(anchorID).offset().top }, {
      duration: 800,
      complete: callback
    });
  };

  onCreate();

}]);

