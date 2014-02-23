'use strict';

angular.module('services', [

])

.factory('nodesRepository', ['$q', '$http', 'configuration', function($q, $http, configuration) {

  return {
    list: function() {
      var url = configuration.serverUrl + 'nodes';
      var deferred = $q.defer();

      $http.get(url).success(function(response) {
        deferred.resolve(response);
      });

      return deferred.promise;
    }
  };
}]);