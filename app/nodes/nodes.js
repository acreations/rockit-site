'use strict';

angular.module('nodes', [
  'nodes.services',
  'razberry'
])

.config(function ($routeProvider) {
  $routeProvider.when('/nodes', {
    templateUrl: 'nodes/nodes.html',
    controller:  'NodesCtrl'
  });
})

.controller('NodesCtrl', ['$scope', '$location', '$log', 'nodesRepository',
  function ($scope, $location, $log, nodesRepository) {

  var repository  = {};

  $scope.retrieveNodes = function() {
    nodesRepository.list().then(
      function(data) {
        $log.debug('Nodes repository :: success', data);
        repository.nodes = data;

        $scope.presentation = {};
        $scope.presentation.groups = normalize(repository.nodes, 3);
      }, function(reason) {
        $log.warn('Nodes repository :: reject', reason);
      }, function(update) {
        $log.info('Nodes repository :: updates', update);
      }
    );
  };

  $scope.selectNode = function(node) {
    $location.path('/nodes/' + node.association.name.toLowerCase() + '/' + node.url);
  };

  var normalize = function(nodes, sizePerRow) {
    var result = [];

    var current = [];
    angular.forEach(nodes, function(node) {
      if(current.length === sizePerRow) {
        result.push(initializeGroup(current));
        current = [];
      }

      current.push(node);
    });

    if(current.length > 0) {
      result.push(initializeGroup(current));
    }

    return result;
  };

  var initializeGroup = function(nodes) {
    $log.debug('Init group ::', nodes);
    return {
      'nodes': nodes,
      'selected': null
    };
  };

  var onCreate = function() {
    $scope.retrieveNodes();
  };

  onCreate();
}]);