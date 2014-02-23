'use strict';

angular.module('services', [

])

.factory('nodesRepository', ['$q', '$http', 'configuration', function($q, $http, configuration) {

  var urls = {
    'list': configuration.serverUrl + 'nodes'
  }

  if(configuration.mocksEnabled) {
    urls.list = '/mocks/nodes/nodes.json';
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