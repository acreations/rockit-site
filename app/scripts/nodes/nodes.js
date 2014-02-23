'use strict';

angular.module('nodes', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/nodes', {
    templateUrl: 'views/pages/nodes.html',
    controller:  'NodesCtrl'
  });
})

.controller('NodesCtrl', ['$scope', 'nodesRepository', function ($scope, nodesRepository) {

  var repository  = {};

  this.getNodes = function() {
    nodesRepository.list().then(
      function(data) {
        repository.nodes = data;
        $scope.nodes = repository.nodes;
      });
  };

  this.onCreate = function() {
    this.getNodes();
  };

  this.onCreate();

}]);