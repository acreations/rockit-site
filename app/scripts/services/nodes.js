'use strict';

angular.module('services', [

])

.factory('nodesRepository', ['$q', '$http', 'configuration', function($q, $http, configuration) {

  var serviceUrl = configuration.serverUrl + 'nodes';

  var urls = {
    'list': serviceUrl,
    'get': serviceUrl
  }

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