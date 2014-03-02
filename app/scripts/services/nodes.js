'use strict';

angular.module('services', [

])

.factory('genericRepository', ['$q', '$http', function($q, $http) {

  return {
    get: function(url) {
      var deferred = $q.defer();

      $http.get(url).success(function(response) {
        deferred.resolve(response);
      });

      return deferred.promise;
    },
    update: function(url, data) {
      var deferred = $q.defer();

      $http.put(url, data).success(function(response) {
        deferred.resolve(response);
      });

      return deferred.promise;
    }
  };
}])

.factory('nodesRepository', ['$q', '$http', 'configuration', function($q, $http, configuration) {

  var serviceUrl = configuration.serverUrl + 'nodes';

  if(configuration.mocksEnabled) {
    serviceUrl = '/mocks/nodes_list.json';
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