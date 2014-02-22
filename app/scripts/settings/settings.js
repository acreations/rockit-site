angular.module('settings', [

])

.config(function ($routeProvider) {
    $routeProvider.when('/settings', {
        templateUrl: 'views/pages/settings.html',
        controller:  'SettingsCtrl'
    })
})

.controller('SettingsCtrl', ['$scope', function ($scope) {

}])