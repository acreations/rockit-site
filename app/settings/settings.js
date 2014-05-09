'use strict';

angular.module('settings', [
  'settings.services'
])

.config(function ($routeProvider) {
  $routeProvider
    .when('/settings/:association', {
      templateUrl: 'settings/settings.html',
      controller:  'SettingsCtrl'
    })
    .when('/settings', { redirectTo:'/settings/Rockit' })
  ;
})

.controller('SettingsCtrl', ['$scope', '$log', '$routeParams', 'settingsRepository', 'repository',
    function ($scope, $log, $routeParams, settingsRepository, repository) {

  $scope.settings = {};
  $scope.active   = {};

  var retrieveActive = function(active) {
    if(active) {
      repository.get(active.url).then(
        function(data) {
          $scope.active.settings = data;
        },
        function() {
      });
    }
  };

  var retrieveSettings = function() {
    settingsRepository.list().then(
      function(data) {
        angular.forEach(data, function(item) {
          item.active = item.name === $routeParams.association;

          if(item.active) {
            $scope.active = item;
          }
        });
        $scope.settings = data;

        retrieveActive($scope.active);
      }, function(reason) {
        $log.warn('Repository :: reject', reason);
      }, function(update) {
        $log.info('Repository :: updates', update);
      }
    );
  };

  var onCreate = function() {
    retrieveSettings();
  };

  onCreate();

}]);