'use strict';

angular.module('common', [

])

.controller('RockitConfirmCtrl', function ($scope, $modalInstance) {

  $scope.yes = function () {
    $modalInstance.close();
  };

  $scope.no = function () {
    $modalInstance.dismiss('no');
  };

});