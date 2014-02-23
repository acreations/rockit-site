'use strict';

angular.module('rockit', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'dashboard',
  'nodes',
  'mixes',
  'settings',
  'services'
])

.service('configuration', function() {

  this.initialize = function() {
    this.serverUrl = 'http://localhost:8000/rockit/';
  };

  this.initialize();
})

.config(function ($routeProvider) {
  $routeProvider.otherwise({ redirectTo: '/' });
})

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  //$httpProvider.defaults.headers.post['X-CSRFToken'] = $('input[name=csrfmiddlewaretoken]').val();
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])

.controller('RockitCtrl', ['$scope', '$location', function ($scope, $location) {

  $scope.go = function(path) {
    $location.path(path);
  };

}]);