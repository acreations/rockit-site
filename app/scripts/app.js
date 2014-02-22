'use strict';

angular.module('rockit', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'dashboard',
  'nodes',
  'mixes',
  'settings'
])

.service('rockitConfigure', function() {

  this.initialize = function() {
    this.useMocks = false;
  }

  this.initialize();
})

.config(function ($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });
});
