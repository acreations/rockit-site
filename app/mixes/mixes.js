'use strict';

angular.module('mixes', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/mixes', {
    templateUrl: 'mixes/mixes.html',
    controller:  'MixesCtrl'
  });
})

.controller('MixesCtrl', ['$scope', function ($scope) {

  $scope.hello = 'Mixes';

}]);