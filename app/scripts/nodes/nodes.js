'use strict';

angular.module('nodes', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/nodes', {
    templateUrl: 'views/pages/nodes.html',
    controller:  'NodesCtrl'
  });
})

.factory('nodesRepository', ['$q', '$http', 'configuration', function($q, $http, configuration) {

  return {
    get: function() {
      var url = configuration.serverUrl + 'nodes';
      var deferred = $q.defer();

      $http.get(url).success(function(response) {
        console.log('response', response);

        deferred.resolve('Hello nodes');
      });

      return deferred.promise;
    }
  };
}])

.controller('NodesCtrl', ['$scope', 'nodesRepository', function ($scope, nodesRepository) {

  this.initialize = function() {
    nodesRepository.get().then(
      function(data) {
        $scope.hello = data;
      });
  };

  this.initialize();

}]);