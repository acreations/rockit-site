angular.module('nodes', [

])

.config(function ($routeProvider) {
    $routeProvider.when('/nodes', {
        templateUrl: 'views/pages/nodes.html',
        controller:  'NodesCtrl'
    })
})

.controller('NodesCtrl', ['$scope', function ($scope) {

    $scope.hello = 'HELLO NODES'

}])