'use strict';

angular.module('rockit', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'pascalprecht.translate',
  'dashboard',
  'nodes',
  'mixes',
  'settings',
  'services'
])

.service('configuration', function() {

  this.initialize = function() {
    this.serverUrl = 'http://localhost:8000/rockit/';
    this.mocksEnabled = true;
  };

  this.initialize();
})

.config(function ($logProvider) {
  $logProvider.debugEnabled(true);
})

.config(function ($routeProvider) {
  $routeProvider.otherwise({ redirectTo: '/' });
})

.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.useLoader('$translatePartialLoader', {
    urlTemplate: '/resources/i18n/{lang}/{part}.json'
  });
  $translateProvider.preferredLanguage('en');
}])

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