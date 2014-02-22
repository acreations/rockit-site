angular.module('dashboard', [

])

.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/pages/dashboard.html',
        controller:  'DashboardCtrl'
    })
})

.controller('DashboardCtrl', ['$scope', function ($scope) {

}])