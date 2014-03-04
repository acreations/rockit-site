'use strict';

angular.module('services', [])
.factory('settingsRepository', ['$q', '$http', 'configuration', function($q, $http, configuration) {

  var serviceUrl = configuration.serverUrl + 'settings';

  return {
    list: function() {
      var deferred = $q.defer();

      $http.get(serviceUrl).success(function(response) {
        deferred.resolve(response);
      });

      return deferred.promise;
    }
  };
}]);