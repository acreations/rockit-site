'use strict';

angular.module('nodes.services', [])
.factory('nodesRepository', ['$q', '$http', 'configuration', function($q, $http, configuration) {

  var serviceUrl = configuration.serverUrl + 'nodes';

  if(configuration.mocksEnabled) {
    serviceUrl = '/nodes/nodes-list.json';
  }

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