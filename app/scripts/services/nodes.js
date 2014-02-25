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
    }
  };
}])

.factory('nodesRepository', ['$q', '$http', 'configuration', function($q, $http, configuration) {

  var serviceUrl = configuration.serverUrl + 'nodes';

  var urls = {
    'list': serviceUrl
  };

  if(configuration.mocksEnabled) {
    urls.list = '/mocks/nodes_list.json';
  }

  return {
    list: function() {
      var url = urls.list;
      var deferred = $q.defer();

      $http.get(url).success(function(response) {
        deferred.resolve(response);
      });

      return deferred.promise;
    }
  };
}]);