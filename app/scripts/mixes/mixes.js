angular.module('mixes', [

])

.config(function ($routeProvider) {
    $routeProvider.when('/mixes', {
        templateUrl: 'views/pages/mixes.html',
        controller:  'MixesCtrl'
    })
})

.controller('MixesCtrl', ['$scope', function ($scope) {

}])