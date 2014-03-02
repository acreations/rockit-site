'use strict';

angular.module('dashboard', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'dashboard/dashboard.html',
    controller:  'DashboardCtrl'
  });
})

.controller('DashboardCtrl', ['$scope', function ($scope) {

  $scope.hello = 'dashboard';
    
}]);