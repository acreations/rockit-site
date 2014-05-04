'use strict';

angular.module('mixes.services', [])
.factory('whenRepository', ['$q', '$http', 'configuration', function($q, $http, configuration) {

  var serviceUrl = configuration.serverUrl + 'when';

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