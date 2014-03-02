'use strict';

angular.module('settings', [

])

.config(function ($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'settings/settings.html',
    controller:  'SettingsCtrl'
  });
})

.controller('SettingsCtrl', ['$scope', function ($scope) {

  $scope.hello = 'settings';

}]);