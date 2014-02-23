'use strict';

angular.module('nodes', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/nodes/:id', {
    templateUrl: 'views/pages/nodes.html',
    controller:  'NodeDetailCtrl'
  });
})

.controller('NodeDetailCtrl', ['$scope', 'nodesRepository', function ($scope, nodesRepository) {

  var repository  = {};

  this.onCreate = function() {
    nodesRepository.list().then(
      function(data) {
        repository.nodes = data;
        $scope.nodes = repository.nodes;
      }
    );
  };

  this.onCreate();

}]);