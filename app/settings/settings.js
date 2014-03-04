'use strict';

angular.module('settings', [
  'settings.services'
])

.config(function ($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'settings/settings.html',
    controller:  'SettingsCtrl'
  });
})

.controller('SettingsCtrl', ['$scope', '$log', 'settingsRepository',
    function ($scope, $log, settingsRepository) {

  $scope.hello = 'settings';

  $scope.settings = {};

  var repository = {};

  var retrieveSettings = function() {
    settingsRepository.list().then(
      function(data) {
        $log.debug('Repository :: success', data);
        repository.list = data;

        $scope.settings.all = repository.list;
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